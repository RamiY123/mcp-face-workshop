import { expect, test } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { resolve } from 'node:path';
import { manifest } from '../shared/manifest.js';
test('the prepared listing tool works before and after student exercises', async () => {
  const client = new Client({ name: 'participant-baseline', version: '1.0.0' });
  try {
    await client.connect(new StdioClientTransport({ command: process.execPath, args: [resolve('dist/mcp/index.js')] }));
    expect((await client.listTools()).tools.map(t => t.name)).toContain('list_expressions');
    const response = await client.callTool({ name: 'list_expressions', arguments: {} });
    expect(JSON.parse((response.content as { text: string }[])[0].text)).toEqual(manifest);
  } finally { await client.close(); }
});
