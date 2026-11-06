import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../', import.meta.url));
for (const file of ['.mcp.json', '.vscode/mcp.json', 'solutions', 'scripts/rehearse-workshop.mjs']) {
  await assert.rejects(() => access(resolve(root, file)), { code: 'ENOENT' }, `Fresh participant checkout must not include ${file}`);
}
assert.equal((await readFile(resolve(root, 'exercises/student-tools.ts'), 'utf8')).replaceAll('\r\n','\n'), (await readFile(resolve(root, 'scripts/templates/student-tools.ts.txt'), 'utf8')).replaceAll('\r\n','\n'));
console.log('Fresh participant checkout has no completed configs, solutions, or hidden exercise implementation.');
