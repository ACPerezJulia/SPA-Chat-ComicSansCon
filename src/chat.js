const FAKE_RESPONSES = [
  "¡Yo seré el Rey de los Piratas!",
  "¡Eso suena increíble! ¡Vamos!",
  "¡No me rindo nunca, jamás!",
  "¿Querés ser mi nakama?",
  "¡Tengo hambre! ¿Dónde está Sanji?",
];

let messages = [];

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
  if (last) last.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function addMessage(role, content) {
  messages.push({ role, content, timestamp: Date.now() });
  renderMessages();
}

function showTyping() {
  const indicator = document.getElementById('typing-indicator');
  if (!indicator) return;
  indicator.classList.add('visible');
  indicator.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function hideTyping() {
  document.getElementById('typing-indicator')?.classList.remove('visible');
}

function simulateResponse() {
  showTyping();
  setTimeout(() => {
    hideTyping();
    const reply = FAKE_RESPONSES[Math.floor(Math.random() * FAKE_RESPONSES.length)];
    addMessage('character', reply);
  }, 1500);
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
    simulateResponse();
  });
}
