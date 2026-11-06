import { test, expect } from 'vitest';
import { mkdtemp, mkdir, cp, writeFile, symlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
test('connection check uses both client config shapes and rejects the wrong launch path', async () => {
  const root = await mkdtemp(resolve(tmpdir(), 'face-connection-test-'));
  await mkdir(resolve(root, 'scripts'));
  await mkdir(resolve(root, '.vscode'));
  await cp('scripts/check-connection.mjs', resolve(root, 'scripts/check-connection.mjs'));
  const linkType = process.platform === 'win32' ? 'junction' : 'dir';
  await symlink(resolve('node_modules'), resolve(root, 'node_modules'), linkType);
  await symlink(resolve('dist'), resolve(root, 'dist'), linkType);
  // These fixture configurations are test inputs, not shipped working participant connections.
  const server = { type: 'stdio', command: 'node', args: ['${workspaceFolder}/dist/mcp/index.js'] };
  await writeFile(resolve(root, '.vscode/mcp.json'), JSON.stringify({ servers: { 'face-workshop': server } }));
  await writeFile(resolve(root, '.mcp.json'), JSON.stringify({ mcpServers: { 'face-workshop': { ...server, args: ['dist/mcp/index.js'] } } }));
  const run = (client: string) => spawnSync(process.execPath, ['scripts/check-connection.mjs', client], { cwd: root, encoding: 'utf8', windowsHide: true });
  for (const client of ['copilot', 'claude']) {
    const result = run(client);
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain('launched the actual stdio server');
  }
  await writeFile(resolve(root, '.mcp.json'), JSON.stringify({ mcpServers: { 'face-workshop': { ...server, args: ['another-server.js'] } } }));
  const invalid = run('claude');
  expect(invalid.status).not.toBe(0);
  expect(invalid.stderr).toContain('this checkout');
});
