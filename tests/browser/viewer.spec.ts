import { test, expect } from '@playwright/test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { resolve } from 'node:path';
import { createApp } from '../../server/app.js';
test('manual controls and MCP calls visibly update the browser, including after refresh', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#connection')).toContainText('Connected');
  await expect(page.locator('#face')).toHaveAttribute('alt', /Neutral expression/);
  await page.getByRole('button', { name: '02Smug' }).click();
  await expect(page.locator('#current')).toHaveText('Smug');
  const client = new Client({ name: 'browser-test', version: '1.0.0' });
  try {
    await client.connect(new StdioClientTransport({ command: process.execPath, args: [resolve('dist/mcp/index.js')], env: { ...process.env as Record<string, string>, FACE_PORT: '3344' } }));
    for (const name of ['shocked', 'eye_roll', 'wink', 'confused']) {
      const response = await client.callTool({ name: 'set_expression', arguments: { name } });
      expect(JSON.parse((response.content as { text: string }[])[0].text)).toMatchObject({ name, displayed: true, status: 'displayed' });
      await expect(page.locator('#face')).toHaveAttribute('src', new RegExp(`${name}.svg$`));
    }
    await page.reload();
    await expect(page.locator('#current')).toHaveText('Confused');
    await expect.poll(async () => (await (await page.request.get('/api/state')).json()).displayed).toBe(true);
    await page.screenshot({ path: 'test-results/viewer-desktop.png', fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: 'test-results/viewer-mobile.png', fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await client.callTool({ name: 'reset_expression', arguments: {} });
    await expect(page.locator('#current')).toHaveText('Neutral');
  } finally { await client.close(); }
});
test('missing image does not produce a false display confirmation', async ({ page, request }) => {
  await page.route('**/assets/expressions/wink.svg', route => route.abort());
  await page.goto('/');
  await expect(page.locator('#connection')).toContainText('Connected');
  const response = await request.post('/api/expression', { data: { name: 'wink', source: 'mcp' } });
  expect(await response.json()).toMatchObject({ displayed: false, status: 'accepted_unconfirmed' });
  await expect(page.locator('#feedback')).toContainText('Cannot confirm display');
});
test('SSE reconnect restores the latest command after connection loss', async ({ page, request }) => {
  const server = createApp().listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const url = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  try {
    await page.goto(url);
    await expect(page.locator('#current')).toHaveText('Neutral');
    await expect(page.locator('#connection')).toContainText('Connected');
    server.closeAllConnections();
    await expect(page.locator('#connection')).toContainText('Reconnecting');
    await request.post(`${url}/api/expression`, { data: { name: 'smug' } });
    await expect(page.locator('#connection')).toContainText('Connected', { timeout: 15000 });
    await expect(page.locator('#current')).toHaveText('Smug');
  } finally {
    await page.close();
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
