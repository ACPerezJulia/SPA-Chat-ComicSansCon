import { initChat } from './chat.js';

const container = () => document.getElementById('view-container');

// ── Funciones de render ──────────────────────────────────────────────────────

function renderHome() {
  container().innerHTML = `
    <div class="view-content">
      <p class="home__eyebrow">Monkey D. Luffy · One Piece</p>
      <h1 class="home__title">¡Yo seré el Rey de los Piratas!</h1>
      <p class="home__description">
        Luffy es el Capitán de la Banda del Sombrero de Paja y el pirata más
        libre de los mares. Comió la Fruta Gomu Gomu y su cuerpo es de goma.
        Su sueño es encontrar el One Piece y convertirse en el Rey de los Piratas.
        ¿Te animás a charlar con él?
      </p>
      <button class="btn" id="btn-chat">Empezar a chatear</button>
    </div>
  `;
  document.getElementById('btn-chat').addEventListener('click', () => navigateTo('/chat'));
}

function renderChat() {
  container().innerHTML = `
    <div class="chat-layout">
      <section class="messages" id="messages-container">
        <div class="typing-indicator" id="typing-indicator">
          <span>Luffy está escribiendo</span>
          <div class="typing-dots">
            <i></i><i></i><i></i>
          </div>
        </div>
      </section>
      <form class="composer" id="composer-form">
        <input
          class="composer__input"
          id="composer-input"
          type="text"
          placeholder="Escribí tu mensaje..."
          autocomplete="off"
        />
        <button class="composer__send" type="submit">Enviar</button>
      </form>
    </div>
  `;
  initChat();
}

function renderAbout() {
  container().innerHTML = `
    <div class="view-content">
      <h1 class="about__title">Acerca del Proyecto</h1>
      <div class="about__section">
        <h3>Descripción</h3>
        <p>Somos ComicSansCon, una agencia digital especializada en experiencias
        interactivas para fans de videojuegos, películas y series. Esta app es
        una prueba de concepto (POC) donde los usuarios pueden chatear con
        personajes ficticios usando inteligencia artificial. Integramos Google
        Gemini AI de forma segura para que las conversaciones sean naturales y
        el personaje mantenga su personalidad en todo momento.</p>
      </div>
      <div class="about__section">
        <h3>Tecnologías</h3>
        <ul class="tech-list">
          <li>Vanilla JS</li>
          <li>History API</li>
          <li>Vercel Functions</li>
          <li>Google Gemini AI</li>
          <li>CSS Mobile-first</li>
          <li>Vitest</li>
        </ul>
      </div>
      <div class="about__section">
        <h3>Desarrolladora</h3>
        <p>Analía Pérez Juliá</p>
      </div>
    </div>
  `;
}

function renderNotFound() {
  container().innerHTML = `
    <div class="view-content not-found">
      <h1>404</h1>
      <p>Esta página no existe.</p>
      <a href="/home" class="btn">Volver al inicio</a>
    </div>
  `;
}

// ── Tabla de rutas ───────────────────────────────────────────────────────────

const routes = {
  '/':      renderHome,
  '/home':  renderHome,
  '/chat':  renderChat,
  '/about': renderAbout,
};

// ── Router: lee la URL actual y ejecuta la función de render correspondiente ─

function router() {
  const render = routes[window.location.pathname];
  render ? render() : renderNotFound();
}

// ── navigateTo: cambia la URL y llama al router ──────────────────────────────
// router() solo sabe renderizar según la URL actual.
// navigateTo() es quien cambia la URL antes de llamar al router.
// Separarlas permite que popstate use router() directamente (el navegador
// ya cambió la URL) sin necesidad de volver a hacer pushState.

export function navigateTo(path) {
  history.pushState(null, '', path);
  router();
}

// ── Intercepción de clicks con delegación de eventos ────────────────────────

document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  if (e.ctrlKey || e.metaKey) return;
  if (link.target === '_blank') return;
  if (!link.href.startsWith(location.origin)) return;

  e.preventDefault();
  navigateTo(link.getAttribute('href'));
});

// ── Botones back/forward del navegador ──────────────────────────────────────

window.addEventListener('popstate', router);

// ── Carga inicial ────────────────────────────────────────────────────────────

router();
