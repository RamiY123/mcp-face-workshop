import { mkdir, cp, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const target = resolve(root, 'workshop-starter');
// mkdir is intentionally non-recursive: an existing copy must never be overwritten.
await mkdir(target);
for (const path of ['package.json', 'package-lock.json', 'tsconfig.json', 'vite.config.ts', 'vitest.config.ts', 'playwright.config.ts', '.gitignore', '.mcp.json', '.vscode', '.github', '.claude', 'AGENTS.md', 'CLAUDE.md', 'README.md', 'LICENSE', 'web', 'server', 'shared', 'mcp', 'assets', 'scripts', 'docs', 'exercises', 'solutions', 'tests', 'preparation']) {
  await cp(resolve(root, path), resolve(target, path), { recursive: true });
}
const entry = resolve(target, 'mcp/index.ts');
const code = await readFile(entry, 'utf8');
await writeFile(entry, code.replace("process.env.WORKSHOP_MODE === 'starter'", "process.env.WORKSHOP_MODE !== 'solution'"));
console.log(`Starter created at ${target}. Run npm ci and npm run build inside it. Edit exercises/student-tools.ts. The full demo remains unchanged.`);
