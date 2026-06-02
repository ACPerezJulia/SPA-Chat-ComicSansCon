let messages = [];

export function resetMessages() {
  messages = [];
}

function renderMessages() {
  const container = document.getElementById('messages-container');
  if (!container) return;

  const indicator = document.getElementById('typing-indicator');

  container.innerHTML = '';

  messages.forEach((msg) => {
    const el = document.createElement('div');
    el.className = `message message--${msg.role === 'user' ? 'user' : 'character'}`;
    el.textContent = msg.content;
    container.appendChild(el);
  });

  if (indicator) container.appendChild(indicator);

  const last = container.lastElementChild;
  if (last?.scrollIntoView) last.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function addMessage(role, content) {
  messages.push({ role, content, timestamp: Date.now() });
  renderMessages();
}

function showTyping() {
  const indicator = document.getElementById('typing-indicator');
  if (!indicator) return;
  indicator.classList.add('visible');
  if (indicator.scrollIntoView) indicator.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function hideTyping() {
  document.getElementById('typing-indicator')?.classList.remove('visible');
}

async function sendToGemini() {
  showTyping();

  try {
    // Enviamos los últimos 12 mensajes para no desperdiciar tokens
    const payload = messages.slice(-12);

    const response = await fetch('/api/functions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: payload }),
    });

    // Los errores HTTP (4xx, 5xx) NO lanzan excepción automáticamente.
    // Hay que verificar response.ok y lanzar el error manualmente.
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error: ${response.status}`);
    }

    addMessage('character', data.reply);
  } catch (err) {
    const msg = err.message || 'Luffy está en el mar sin señal, intentá de nuevo.';
    addMessage('character', msg);
  } finally {
    // finally garantiza que el loading se apague siempre, incluso si hubo error
    hideTyping();
  }
}

export function initChat() {
  const form = document.getElementById('composer-form');
  const input = document.getElementById('composer-input');
  if (!form || !input) return;

  renderMessages();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    addMessage('user', text);
    input.value = '';
    sendToGemini();
  });
}
