import './style.css';
type Expression = { id: string; label: string; description: string; asset: string };
type State = { name: string; commandId: string; viewerId: string; changedAt: string; source: string };
const element = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const connection = element('connection');
const feedback = element('feedback');
const face = element<HTMLImageElement>('face');
let latestCommand = '';
let connected = false;
let busy = false;
const buttons: HTMLButtonElement[] = [];
function updateButtons() { for (const button of buttons) button.disabled = !connected || busy; }
function log(message: string) {
  const entry = document.createElement('li');
  const time = document.createElement('time');
  time.textContent = new Date().toLocaleTimeString([], { hour12: false });
  entry.append(time, document.createTextNode(message));
  const list = element('log');
  list.prepend(entry);
  while (list.children.length > 6) list.lastChild?.remove();
}
async function start() {
  const response = await fetch('/api/expressions');
  if (!response.ok) throw new Error('Could not load expression manifest');
  const manifest = await response.json() as { temporary: boolean; expressions: Expression[] };
  element('asset-note').textContent = manifest.temporary ? 'ILLUSTRATED DEMO · PORTRAIT PENDING' : 'PORTRAIT EXPRESSIONS';
  element('expression-count').textContent = String(manifest.expressions.length);
  for (const [index, expression] of manifest.expressions.entries()) {
    const button = document.createElement('button');
    button.dataset.expression = expression.id;
    button.title = expression.description;
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    button.append(number, document.createTextNode(expression.label));
    button.disabled = true;
    button.addEventListener('click', async () => {
      busy = true; updateButtons();
      try {
        const result = await fetch('/api/expression', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: expression.id, source: 'manual' }), signal: AbortSignal.timeout(5000) });
        const data = await result.json();
        if (!result.ok) throw new Error(data.error);
        feedback.textContent = data.displayed ? 'Displayed in the viewer.' : 'Accepted; display not confirmed yet.';
      } catch (error) { feedback.textContent = (error as Error).message; }
      finally { busy = false; updateButtons(); }
    });
    buttons.push(button); element('buttons').append(button);
  }
  const events = new EventSource('/api/events');
  events.onopen = () => { connected = true; connection.textContent = '● Connected'; connection.className = 'connected'; updateButtons(); };
  events.onerror = () => { connected = false; connection.textContent = '○ Reconnecting…'; connection.className = ''; feedback.textContent = 'Connection lost. Start the app; the viewer will reconnect automatically.'; updateButtons(); };
  events.onmessage = async event => {
    const state = JSON.parse(event.data) as State;
    latestCommand = state.commandId;
    const expression = manifest.expressions.find(e => e.id === state.name);
    if (!expression) { feedback.textContent = `Unknown expression: ${state.name}`; return; }
    try {
      const preload = new Image();
      preload.src = `/assets/expressions/${expression.asset}`;
      await preload.decode();
      if (latestCommand !== state.commandId) return;
      face.src = preload.src; face.alt = `${expression.label} expression${manifest.temporary ? ' (development placeholder)' : ''}`;
      element('current').textContent = expression.label;
      element('source').textContent = `${state.source.toUpperCase()} / ${state.name.toUpperCase()}`;
      for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.expression === state.name));
      // Wait for the loaded image to reach a browser paint opportunity before acknowledging.
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      if (latestCommand !== state.commandId) return;
      const ack = await fetch('/api/ack', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ commandId: state.commandId, viewerId: state.viewerId }) });
      if (!ack.ok) throw new Error('Display acknowledgement rejected; waiting for the latest command.');
      feedback.textContent = 'Viewer ready. Try a reaction.';
      log(`${state.source} → ${expression.label}`);
    } catch (error) { feedback.textContent = `Cannot confirm display: ${(error as Error).message}`; log('Display not confirmed'); }
  };
}
start().catch(error => { feedback.textContent = error.message; connection.textContent = 'Setup error'; });
