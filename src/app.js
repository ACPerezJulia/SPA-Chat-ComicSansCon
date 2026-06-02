const container = () => document.getElementById('view-container');

// ── Funciones de render (placeholders) ──────────────────────────────────────

function renderHome() {
  container().innerHTML = '<h1>Bienvenido al chat con Luffy</h1>';
}

function renderChat() {
  container().innerHTML = '<h1>Vista del Chat (próximamente)</h1>';
}

function renderAbout() {
  container().innerHTML = '<h1>Acerca del proyecto</h1>';
}

function renderNotFound() {
  container().innerHTML = `
    <h1>404 — Página no encontrada</h1>
    <a href="/home">Volver al inicio</a>
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
