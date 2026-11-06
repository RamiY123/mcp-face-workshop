import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
const root = fileURLToPath(new URL('../', import.meta.url));
const clientName = process.argv[2];
const options = { copilot: ['.vscode/mcp.json', 'servers'], claude: ['.mcp.json', 'mcpServers'] };
if (!Object.hasOwn(options, clientName)) throw new Error('Usage: npm run check:connection -- copilot|claude');
const [file, key] = options[clientName];
let config;
try { config = JSON.parse(await readFile(resolve(root, file), 'utf8')); }
catch (error) { throw new Error(`Read ${file}: ${error.message}. Complete the connection exercise in exercises/README.md.`); }
const server = config[key]?.['face-workshop'];
if (!server || server.type !== 'stdio' || server.command !== 'node' || !Array.isArray(server.args) || server.args.length !== 1 || typeof server.args[0] !== 'string') throw new Error('Expected face-workshop with type stdio, command node, and one compiled server argument.');
const entry = resolve(root, server.args[0].replaceAll('${workspaceFolder}', root));
if (entry !== resolve(root, 'dist/mcp/index.js')) throw new Error('The server argument must point to this checkout\'s dist/mcp/index.js.');
if (server.env && (typeof server.env !== 'object' || Object.values(server.env).some(value => typeof value !== 'string'))) throw new Error('Server env must be an object of string values.');
const client = new Client({ name: 'participant-connection-check', version: '1.0.0' });
try {
  await client.connect(new StdioClientTransport({ command: server.command, args: [entry], cwd: root, env: { ...process.env, ...server.env } }));
  const names = (await client.listTools()).tools.map(tool => tool.name);
  if (!names.includes('list_expressions')) throw new Error('Server connected but list_expressions was not discovered.');
  const result = await client.callTool({ name: 'list_expressions', arguments: {} });
  if (result.isError) throw new Error('list_expressions failed.');
  console.log(`PASS: ${file} launched the actual stdio server. Tools: ${names.join(', ')}`);
  console.log('Now perform the same call in your signed-in assistant client; this check validates configuration and protocol, not account access.');
} finally { await client.close(); }
