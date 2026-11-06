import { expect, test } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { createApp } from '../server/app.js';
import { resolve } from 'node:path';
import { manifest } from '../shared/manifest.js';
test('real stdio protocol discovers tools, validates arguments, resets and reports server outage', async () => {
  const server = createApp().listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const port = (server.address() as { port: number }).port;
  const client = new Client({ name: 'workshop-test', version: '1.0.0' });
  const transport = new StdioClientTransport({ command: process.execPath, args: [resolve('dist/mcp/index.js')], env: { ...process.env as Record<string, string>, FACE_PORT: String(port) } });
  try {
    await client.connect(transport);
    expect((await client.listTools()).tools.map(t => t.name)).toEqual(['list_expressions', 'set_expression', 'reset_expression']);
    const listing = await client.callTool({ name: 'list_expressions', arguments: {} });
    expect(JSON.parse((listing.content as { text: string }[])[0].text).expressions).toEqual(manifest.expressions);
    const update = await client.callTool({ name: 'set_expression', arguments: { name: 'wink' } });
    expect(JSON.parse((update.content as { text: string }[])[0].text)).toMatchObject({ name: 'wink', displayed: false });
    const invalid = await client.callTool({ name: 'set_expression', arguments: { name: 'invalid' } });
    expect(invalid.isError).toBe(true);
    const reset = await client.callTool({ name: 'reset_expression', arguments: {} });
    expect(JSON.parse((reset.content as { text: string }[])[0].text).name).toBe('neutral');
    await new Promise<void>(resolve => { server.closeAllConnections(); server.close(() => resolve()); });
    const offline = await client.callTool({ name: 'set_expression', arguments: { name: 'smug' } });
    expect(offline.isError).toBe(true);
    expect((offline.content as { text: string }[])[0].text).toContain('npm start');
  } finally { await client.close(); server.closeAllConnections(); server.close(); }
});
