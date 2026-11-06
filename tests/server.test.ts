import { afterAll, beforeAll, expect, test } from 'vitest';
import { createApp } from '../server/app.js';
import type { Server } from 'node:http';
let server: Server;
let url: string;
beforeAll(async () => {
  server = createApp().listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  url = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
});
afterAll(() => new Promise<void>(resolve => { server.closeAllConnections(); server.close(() => resolve()); }));
const set = (name: string) => fetch(`${url}/api/expression`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
test('commands without a viewer are accepted, never reported as displayed', async () => {
  const result = await (await set('smug')).json();
  expect(result).toMatchObject({ name: 'smug', accepted: true, displayed: false, status: 'accepted_no_viewer' });
});
test('invalid IDs and malformed JSON leave state intact', async () => {
  await set('confused');
  expect((await set('not-a-face')).status).toBe(400);
  expect((await fetch(`${url}/api/expression`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })).status).toBe(400);
  expect(await (await fetch(`${url}/api/state`)).json()).toMatchObject({ name: 'confused' });
});
test('rejects foreign origins and unknown viewer acknowledgements', async () => {
  expect((await fetch(`${url}/api/expression`, { method: 'POST', headers: { Origin: 'https://example.com', 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'neutral' }) })).status).toBe(403);
  const state = await (await fetch(`${url}/api/state`)).json();
  expect((await fetch(`${url}/api/ack`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ commandId: state.commandId, viewerId: 'invented' }) })).status).toBe(409);
});
test('a connected stream without image acknowledgement is unconfirmed', async () => {
  const controller = new AbortController();
  const response = await fetch(`${url}/api/events`, { signal: controller.signal });
  const reader = response.body!.getReader();
  const initial = new TextDecoder().decode((await reader.read()).value);
  expect(initial).toContain('confused');
  const result = await (await set('shocked')).json();
  expect(result).toMatchObject({ displayed: false, status: 'accepted_unconfirmed' });
  controller.abort();
});
