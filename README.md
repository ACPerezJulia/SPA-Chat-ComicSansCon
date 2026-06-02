# LuffyChat

🔗 **[Ver app en producción](https://proyecto-integrador-m3-analia-perez.vercel.app/)**

Prueba de concepto (POC) desarrollada para **ComicSansCon**, agencia digital especializada en experiencias interactivas para fans de videojuegos, películas y series.

LuffyChat es una SPA de chat responsive que permite a los usuarios tener conversaciones naturales con **Monkey D. Luffy** de One Piece, usando Google Gemini AI como motor de respuestas. La API key nunca se expone al cliente gracias a una Vercel Serverless Function que actúa como proxy seguro.

---

## El personaje: Monkey D. Luffy

Monkey D. Luffy es el protagonista del manga/anime **One Piece** creado por Eiichiro Oda. Es el Capitán de la Banda del Sombrero de Paja y su sueño es convertirse en el **Rey de los Piratas** encontrando el legendario tesoro One Piece.

Comió la **Fruta Gomu Gomu** (una Fruta del Diablo), lo que convirtió su cuerpo en goma y le permite estirarse a voluntad. Su personalidad es simple, directa y extremadamente optimista: nunca se rinde, no entiende el sarcasmo y valora a sus amigos por encima de todo.

Su tripulación, la **Banda del Sombrero de Paja**, incluye a Zoro, Nami, Usopp, Sanji, Chopper, Robin... y no te quiero spoilear más!

---

## Requisitos

- Node.js v20 o superior
- Cuenta en [Vercel](https://vercel.com)
- API key de [Google AI Studio](https://aistudio.google.com)

---

## Ejecutar localmente

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd ProyectoIntegrador-M3-AnaliaPerezJulia
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiá el archivo de ejemplo y completá con tu API key:

```bash
cp .env.example .env
```

Editá `.env`:

```
GEMINI_API_KEY=tu_clave_de_google_ai_studio
```

### 4. Iniciar el servidor de desarrollo

```bash
vercel dev
```

La app queda disponible en `http://localhost:3000`.

> Se requiere `vercel dev` (no abrir el HTML directamente) porque la History API y las Serverless Functions necesitan un servidor real.

---

## Ejecutar los tests

```bash
npm test
```

Corre 12 tests unitarios con Vitest:

- `tests/utils.test.js` — funciones de formateo y validación
- `tests/app.test.js` — integración con fetch mockeado (éxito, error HTTP y caída de red)

---

## Deploy en Vercel

### Opción A — Deploy desde GitHub (recomendado)

1. Subí el repositorio a GitHub
2. Entrá a [vercel.com](https://vercel.com) → **Add New Project**
3. Importá el repositorio
4. En **Environment Variables** agregá:
   - `GEMINI_API_KEY` → tu clave (marcala como **Sensitive**)
   - Si no encontrás la sección, entrá directo a `https://vercel.com/dashboard/tu-proyecto/settings/environment-variables`
5. Hacé click en **Deploy**

> Después de guardar las variables de entorno, hacé un nuevo push o ejecutá `vercel --prod` para que el deployment las tome.

### Opción B — Deploy desde la CLI

```bash
vercel --prod
```

---

## Verificar el deploy

Una vez desplegada, verificá que:

- La URL pública carga correctamente
- La navegación SPA funciona (back/forward del navegador)
- Entrar directo a `/chat` o `/about` muestra la vista correcta (no un 404)
- El chat conecta con Gemini en producción

---

## Tecnologías

| Tecnología                            | Uso                                        |
| ------------------------------------- | ------------------------------------------ |
| Vanilla JS (ES Modules)               | Lógica del frontend                        |
| History API                           | Routing SPA sin recarga                    |
| CSS Mobile-first                      | Diseño responsive (320px → 768px → 1024px) |
| Vercel Functions                      | Proxy seguro a la API de Gemini            |
| Google Gemini AI (`gemini-2.5-flash`) | Motor de respuestas del personaje          |
| Vitest + jsdom                        | Tests unitarios                            |

---

## Estructura del proyecto

```
├── api/
│   └── functions.js      # Serverless Function — proxy a Gemini
├── src/
│   ├── index.html
│   ├── styles.css
│   ├── app.js            # Routing con History API
│   ├── chat.js           # Lógica del chat
│   └── utils.js          # Funciones utilitarias
├── tests/
│   ├── utils.test.js
│   └── app.test.js
├── .env.example
├── vercel.json
└── package.json
```

---

## Desarrolladora

**Analía Pérez Juliá**

---

## Licencia

MIT © 2026 Halina87
