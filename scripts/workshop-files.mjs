import { mkdir, cp, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const workshopFiles = ['package.json', 'package-lock.json', 'tsconfig.json', 'vite.config.ts', 'vitest.config.ts', 'playwright.config.ts', '.gitignore', '.mcp.json', '.vscode', '.github', '.claude', '.agents', 'AGENTS.md', 'CLAUDE.md', 'README.md', 'LICENSE', 'web', 'server', 'shared', 'mcp', 'assets', 'scripts', 'docs', 'exercises', 'solutions', 'tests', 'preparation'];

export async function createStarter(root, target) {
  // Refuse an existing destination; never merge into a participant's previous copy.
  await mkdir(target);
  for (const path of workshopFiles) await cp(resolve(root, path), resolve(target, path), { recursive: true });
  const entry = resolve(target, 'mcp/index.ts');
  const code = await readFile(entry, 'utf8');
  const demoCondition = "process.env.WORKSHOP_MODE === 'starter'";
  const starterCondition = "process.env.WORKSHOP_MODE !== 'solution'";
  if (!code.includes(demoCondition) && !code.includes(starterCondition)) throw new Error('Unrecognized MCP entry point; review starter generation.');
  await writeFile(entry, code.replace(demoCondition, starterCondition));
  await cp(resolve(root, 'scripts/templates/student-tools.ts.txt'), resolve(target, 'exercises/student-tools.ts'));
  await writeFile(resolve(target, '.workshop-starter.json'), JSON.stringify({ kind: 'mcp-face-workshop-starter', version: 1 }, null, 2));
}
