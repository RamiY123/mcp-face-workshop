import { mkdtemp, mkdir, cp, writeFile, readFile, access, readdir, symlink, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { createStarter } from './workshop-files.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const workspace = await mkdtemp(resolve(tmpdir(), 'mcp-face-rehearsal-'));
const student = resolve(workspace, 'student');
const reportDir = resolve(root, 'test-results');
await mkdir(reportDir, { recursive: true });
const report = { startedAt: new Date().toISOString(), workspace, status: 'running', checks: [], limitations: ['No signed-in assistant conversation is automated.', 'Assets are development placeholders.'] };
const env = { ...process.env };
delete env.WORKSHOP_MODE; // Test the generated starter's default, not an environment override.
const npmPath = process.env.npm_execpath;
if (!npmPath) throw new Error('Run via npm run test:rehearsal so the current npm executable can be reused.');
async function run(args, cwd = student, expected = 0) {
  const code = await new Promise((resolveCode, reject) => {
    const child = spawn(process.execPath, args, { cwd, env, stdio: 'inherit', windowsHide: true });
    child.once('error', reject);
    child.once('exit', (code, signal) => signal ? reject(new Error(`Process terminated: ${signal}`)) : resolveCode(code));
  });
  if (expected === 'failure') assert.notEqual(code, 0, 'Expected a protective refusal');
  else assert.equal(code, expected, `Command failed: ${args.join(' ')}`);
}
const npm = (...args) => run([npmPath, ...args]);
async function check(name, fn) {
  console.log(`\nREHEARSAL: ${name}`);
  const start = Date.now();
  try { await fn(); report.checks.push({ name, status: 'passed', milliseconds: Date.now() - start }); }
  catch (error) { report.checks.push({ name, status: 'failed', error: error.message }); throw error; }
}
async function assertStarter() {
  const client = new Client({ name: 'student-rehearsal', version: '1.0.0' });
  try {
    await client.connect(new StdioClientTransport({ command: process.execPath, args: [resolve(student, 'dist/mcp/index.js')], env }));
    assert.deepEqual((await client.listTools()).tools.map(t => t.name), ['list_expressions']);
    const result = await client.callTool({ name: 'list_expressions', arguments: {} });
    const manifest = JSON.parse(result.content[0].text);
    const expected = JSON.parse(await readFile(resolve(student, 'assets/expressions/manifest.json'), 'utf8'));
    assert.deepEqual(manifest, expected);
  } finally { await client.close(); }
}
try {
  await check('Generate isolated starter; refuse an existing destination', async () => {
    await createStarter(root, student);
    await assert.rejects(() => createStarter(root, student), { code: 'EEXIST' });
  });
  await check('Clean dependency installation and starter build', async () => { await npm('ci'); await npm('run', 'build'); });
  await check('Fresh starter exposes only the working list tool through stdio', assertStarter);
  await check('Reset refuses an unmarked demo copy', async () => {
    const unmarked = resolve(workspace, 'unmarked');
    await mkdir(resolve(unmarked, 'scripts'), { recursive: true });
    await cp(resolve(root, 'scripts/reset-workshop.mjs'), resolve(unmarked, 'scripts/reset-workshop.mjs'));
    await writeFile(resolve(unmarked, 'keep.txt'), 'preserve me');
    await run(['scripts/reset-workshop.mjs', '--apply'], unmarked, 'failure');
    assert.equal(await readFile(resolve(unmarked, 'keep.txt'), 'utf8'), 'preserve me');
  });
  await check('Complete participant implementation and run all MCP/browser acceptance tests', async () => {
    await cp(resolve(student, 'solutions/tools.ts'), resolve(student, 'exercises/student-tools.ts'));
    await npm('run', 'verify');
  });
  await check('Preview preserves participant code and challenge files', async () => {
    await mkdir(resolve(student, 'exercises/participant'), { recursive: true });
    await writeFile(resolve(student, 'exercises/participant/challenge.txt'), 'participant challenge');
    await writeFile(resolve(student, 'exercises/personal-notes.txt'), 'keep these notes');
    await run(['scripts/reset-workshop.mjs']);
    assert.equal(await readFile(resolve(student, 'exercises/student-tools.ts'), 'utf8'), await readFile(resolve(student, 'solutions/tools.ts'), 'utf8'));
    await access(resolve(student, 'exercises/participant/challenge.txt'));
  });
  await check('Apply reset; verify backups, cleared challenge directory, and preserved notes', async () => {
    await run(['scripts/reset-workshop.mjs', '--apply']);
    const backups = await readdir(resolve(student, '.workshop-backups'));
    assert.equal(backups.length, 1);
    const backup = resolve(student, '.workshop-backups', backups[0]);
    assert.equal(await readFile(resolve(backup, 'exercises/student-tools.ts'), 'utf8'), await readFile(resolve(student, 'solutions/tools.ts'), 'utf8'));
    assert.equal(await readFile(resolve(backup, 'exercises/participant/challenge.txt'), 'utf8'), 'participant challenge');
    await assert.rejects(() => access(resolve(student, 'exercises/participant')), { code: 'ENOENT' });
    assert.equal(await readFile(resolve(student, 'exercises/personal-notes.txt'), 'utf8'), 'keep these notes');
    assert.equal(await readFile(resolve(student, 'exercises/student-tools.ts'), 'utf8'), await readFile(resolve(student, 'scripts/templates/student-tools.ts.txt'), 'utf8'));
  });
  await check('Rebuild reset starter; confirm completed tools are gone from MCP', async () => { await npm('run', 'build'); await assertStarter(); });
  await check('Repeat reset safely when no challenge directory exists', async () => {
    await run(['scripts/reset-workshop.mjs', '--apply']);
    assert.equal((await readdir(resolve(student, '.workshop-backups'))).length, 2);
    assert.equal(await readFile(resolve(student, 'exercises/personal-notes.txt'), 'utf8'), 'keep these notes');
  });
  await check('Refuse a participant directory linked outside the starter', async () => {
    const outside = resolve(workspace, 'outside');
    const link = resolve(student, 'exercises/participant');
    await mkdir(outside);
    await writeFile(resolve(outside, 'keep.txt'), 'outside work');
    await symlink(outside, link, process.platform === 'win32' ? 'junction' : 'dir');
    try {
      await run(['scripts/reset-workshop.mjs', '--apply'], student, 'failure');
      assert.equal(await readFile(resolve(outside, 'keep.txt'), 'utf8'), 'outside work');
      assert.equal((await readdir(resolve(student, '.workshop-backups'))).length, 2);
    } finally { await unlink(link); }
  });
  report.status = 'passed';
} catch (error) {
  report.status = 'failed'; report.error = error.message; process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  await writeFile(resolve(reportDir, 'rehearsal.json'), JSON.stringify(report, null, 2));
  console.log(`\nRehearsal ${report.status}. Report: ${resolve(reportDir, 'rehearsal.json')}\nStudent copy and backups retained at: ${student}`);
}
