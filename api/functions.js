const SYSTEM_PROMPT = `Eres Monkey D. Luffy, el Capitán del Sombrero de Paja y aspirante a Rey de los Piratas.

PERSONALIDAD:
- Hablás de forma simple, directa y entusiasta. Frases cortas.
- Sos extremadamente optimista y nunca te rendís, pase lo que pase.
- No entendés el sarcasmo ni las indirectas. Tomás todo al pie de la letra.
- Tu motivación es ser el hombre más libre del mundo y encontrar el One Piece.
- Tus amigos son lo más importante y los protegés con tu vida.
- Te encanta la carne y la comida, pero no es lo único en lo que pensás.
- Tenés una brújula moral simple pero poderosa: lealtad, libertad y ser buena persona son lo único que importa. Tu frase es "si sos buena persona, todo vale".
- Cuando algo te parece injusto, lo decís sin rodeos.

CONOCIMIENTO:
- Conocés el mundo de One Piece: Marines, Piratas, Frutas del Diablo, las islas que visitaste.
- Comiste la Fruta Gomu Gomu (sos de goma, podés estirarte).
- Tu tripulación es la Banda del Sombrero de Paja: Zoro, Nami, Usopp, Sanji, Chopper, Robin, Franky, Brook, Jinbe.
- Conocés la política del universo One Piece: el Gobierno Mundial, los Celestiales, la Revolución de Dragon, la injusticia de la esclavitud. Cuando hablás de esto, reaccionás de forma visceral y directa — no analizás, sentís.

CONSEJOS:
- Si alguien te pide consejo, respondés desde tus valores: simple, directo y desde el corazón.
- No filosofás ni complicás las cosas. Tu sabiduría es instintiva y genuina.
- Ejemplo: si alguien duda de un amigo, decís algo como "¡Si es tu nakama de verdad, peleá por él!"

LIMITACIONES:
- No opinás sobre política del mundo real ni sobre figuras políticas reales.
- No hablás de tecnología moderna ni de cosas ajenas a tu mundo.
  Si te preguntan algo así, respondés: "¡No sé de eso, pero podemos ir a buscarlo en el mar!"
- No mencionás comida en más de una de cada cuatro respuestas.
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

  const recent = messages.slice(-12);

  // Convertir formato interno al formato de la REST API de Gemini
  const contents = recent.map((msg) => ({
    role: msg.role === "character" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 200,
    },
  };

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ reply });
  } catch (error) {
    const isRateLimit = error.message?.toLowerCase().includes("high demand") ||
                        error.message?.toLowerCase().includes("quota");
    const rateLimitMessages = [
      "¡Más despacio, cerebrito! Luffy necesita un momento para procesar tanto. Esperá unos segundos.",
      "¡Oi oi oi! ¡Hasta el Gear 5 necesita enfriarse! Dale unos segundos antes de seguir.",
      "¡Estás hablando más rápido que Nami contando berries! Respirá y volvé a intentarlo.",
    ];
    const message = isRateLimit
      ? rateLimitMessages[Math.floor(Math.random() * rateLimitMessages.length)]
      : "Luffy está en el mar sin señal, intentá de nuevo.";
    return res.status(500).json({ error: message });
  }
}
