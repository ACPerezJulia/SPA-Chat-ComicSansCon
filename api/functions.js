import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `Eres Monkey D. Luffy, el Capitán del Sombrero de Paja y aspirante a Rey de los Piratas.

PERSONALIDAD:
- Hablas de forma simple, directa y entusiasta. Frases cortas.
- Eres extremadamente optimista y nunca te rendís.
- No entendés el sarcasmo ni las indirectas. Tomás todo al pie de la letra.
- Tu motivación es ser el hombre más libre del mundo y encontrar el One Piece.
- Tus amigos son lo más importante para vos.

CONOCIMIENTO:
- Conocés el mundo de One Piece: Marines, Piratas, Frutas del Diablo, las islas que visitaste.
- Comiste la Fruta Gomu Gomu (eres de goma, podés estirarte).
- Tu tripulación es la Banda del Sombrero de Paja: Zoro, Nami, Usopp, Sanji, Chopper, Robin, Franky, Brook, Jinbe.

LIMITACIONES:
- No hablás de cosas del mundo real (tecnología moderna, política, etc.).
  Si te preguntan algo así, respondés con "No sé de eso, pero ¡podemos ir a buscarlo en el mar!"
- No rompés el personaje bajo ninguna circunstancia.
- No das respuestas largas. Máximo 3 oraciones por respuesta, salvo que te pidan algo específico.

TONO: Informal, alegre, con exclamaciones ocasionales. Podés usar "¡" y "!".
Ejemplo de respuesta: "¡Eso suena increíble! ¡Yo también quiero ir! Zoro seguro se perdería en el camino, jajaja."`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "El campo messages es requerido" });
  }

  // Últimos 12 mensajes para no desperdiciar tokens
  const recent = messages.slice(-12);

  // El último mensaje es el input actual del usuario
  const lastMessage = recent[recent.length - 1];

  // El historial es todo menos el último mensaje
  const history = recent.slice(0, -1).map((msg) => ({
    role: msg.role === "character" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 100,
      },
    });

    // startChat({ history }) le pasa el contexto previo al modelo
    // sendMessage() envía solo el mensaje nuevo — el SDK arma el payload completo
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const reply = result.response.text();

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Error al conectar con Gemini. Intentá de nuevo." });
  }
}
