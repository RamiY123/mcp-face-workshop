import { expect, test } from 'vitest';
import { mkdtemp, mkdir, cp, writeFile, readFile, readdir, access, symlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
async function fixture(role = 'participant') {
  const root = await mkdtemp(resolve(tmpdir(), 'face-reset-test-'));
  await mkdir(resolve(root, 'scripts/templates'), { recursive: true });
  await mkdir(resolve(root, 'exercises/participant'), { recursive: true });
  await mkdir(resolve(root, '.vscode'));
  await cp('scripts/reset-workshop.mjs', resolve(root, 'scripts/reset-workshop.mjs'));
  await cp('scripts/templates/student-tools.ts.txt', resolve(root, 'scripts/templates/student-tools.ts.txt'));
  await writeFile(resolve(root, 'package.json'), JSON.stringify({ name: 'mcp-face-workshop', workshopRole: role }));
  await writeFile(resolve(root, 'exercises/student-tools.ts'), '// student work');
  await writeFile(resolve(root, 'exercises/participant/challenge.txt'), 'challenge');
  await writeFile(resolve(root, 'notes.txt'), 'personal notes');
  await writeFile(resolve(root, '.vscode/mcp.json'), JSON.stringify({ servers: { 'face-workshop': { command: 'node' }, other: { command: 'keep-me' } }, inputs: ['preserve'] }));
  await writeFile(resolve(root, '.mcp.json'), JSON.stringify({ mcpServers: { 'face-workshop': { command: 'node' } } }));
  return root;
}
const run = (root: string, ...args: string[]) => spawnSync(process.execPath, ['scripts/reset-workshop.mjs', ...args], { cwd: root, encoding: 'utf8', windowsHide: true });
test('preview does not change any participant files', async () => {
  const root = await fixture();
  expect(run(root, '--include-client-config').status).toBe(0);
  expect(await readFile(resolve(root, 'exercises/student-tools.ts'), 'utf8')).toBe('// student work');
  await expect(access(resolve(root, '.workshop-backups'))).rejects.toMatchObject({ code: 'ENOENT' });
});
test('full reset backs up work and removes only workshop client entries', async () => {
  const root = await fixture();
  expect(run(root, '--include-client-config', '--apply').status).toBe(0);
  const [name] = await readdir(resolve(root, '.workshop-backups'));
  const backup = resolve(root, '.workshop-backups', name);
  expect(await readFile(resolve(backup, 'exercises/student-tools.ts'), 'utf8')).toBe('// student work');
  expect(await readFile(resolve(backup, 'exercises/participant/challenge.txt'), 'utf8')).toBe('challenge');
  expect(JSON.parse(await readFile(resolve(backup, '.mcp.json'), 'utf8')).mcpServers['face-workshop']).toBeDefined();
  expect(JSON.parse(await readFile(resolve(root, '.vscode/mcp.json'), 'utf8'))).toEqual({ servers: { other: { command: 'keep-me' } }, inputs: ['preserve'] });
  await expect(access(resolve(root, '.mcp.json'))).rejects.toMatchObject({ code: 'ENOENT' });
  await expect(access(resolve(root, 'exercises/participant'))).rejects.toMatchObject({ code: 'ENOENT' });
  expect(await readFile(resolve(root, 'notes.txt'), 'utf8')).toBe('personal notes');
  expect(await readFile(resolve(root, 'exercises/student-tools.ts'), 'utf8')).toBe(await readFile(resolve(root, 'scripts/templates/student-tools.ts.txt'), 'utf8'));
  expect(run(root, '--include-client-config', '--apply').status).toBe(0);
  expect(await readdir(resolve(root, '.workshop-backups'))).toHaveLength(2);
});
test('default reset preserves connection configuration', async () => {
  const root = await fixture();
  const before = await readFile(resolve(root, '.vscode/mcp.json'), 'utf8');
  expect(run(root, '--apply').status).toBe(0);
  expect(await readFile(resolve(root, '.vscode/mcp.json'), 'utf8')).toBe(before);
});
test('malformed config prevents a full reset before any exercise changes', async () => {
  const root = await fixture();
  await writeFile(resolve(root, '.mcp.json'), '{broken');
  const result = run(root, '--include-client-config', '--apply');
  expect(result.status).not.toBe(0);
  expect(result.stderr).toContain('invalid JSON');
  expect(await readFile(resolve(root, 'exercises/student-tools.ts'), 'utf8')).toBe('// student work');
});
test('presenter edition cannot be reset by the participant script', async () => {
  const root = await fixture('presenter');
  expect(run(root, '--apply').stderr).toContain('participant edition');
  expect(await readFile(resolve(root, 'exercises/student-tools.ts'), 'utf8')).toBe('// student work');
});
test('backup directory junction is refused without writing outside', async () => {
  const root = await fixture();
  const outside = await mkdtemp(resolve(tmpdir(), 'face-reset-outside-'));
  await symlink(outside, resolve(root, '.workshop-backups'), process.platform === 'win32' ? 'junction' : 'dir');
  expect(run(root, '--apply').stderr).toContain('Refusing symlink/junction');
  expect(await readdir(outside)).toEqual([]);
});
