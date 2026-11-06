import { lstat, readFile, mkdir, rename, copyFile } from 'node:fs/promises';
import { resolve, relative, isAbsolute, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const apply = process.argv.includes('--apply');
if (process.argv.slice(2).some(arg => arg !== '--apply')) throw new Error('Usage: npm run workshop:reset [-- --apply]');

// Only these two exercise paths are reset. Never accept deletion paths from arguments.
const targets = ['exercises/student-tools.ts', 'exercises/participant'];
async function checkedPath(path) {
  const absolute = resolve(root, path);
  const rel = relative(root, absolute);
  if (!rel || rel.startsWith(`..${sep}`) || rel === '..' || isAbsolute(rel)) throw new Error(`Path escapes the workshop: ${path}`);
  let current = root;
  for (const part of rel.split(sep)) {
    current = resolve(current, part);
    try { if ((await lstat(current)).isSymbolicLink()) throw new Error(`Refusing symlink/junction: ${current}`); }
    catch (error) { if (error.code === 'ENOENT') break; throw error; }
  }
  return absolute;
}
const markerPath = await checkedPath('.workshop-starter.json');
let marker;
try { marker = JSON.parse(await readFile(markerPath, 'utf8')); }
catch { throw new Error('Reset only runs inside a generated starter. From the demo run npm run workshop:starter, then cd workshop-starter. Existing old starters without a marker are left untouched.'); }
if (marker.kind !== 'mcp-face-workshop-starter' || marker.version !== 1) throw new Error('Invalid starter marker; refusing reset.');
const template = await checkedPath('scripts/templates/student-tools.ts.txt');
await readFile(template, 'utf8');
for (const path of targets) await checkedPath(path);
await checkedPath('.workshop-backups');
console.log('Reset scope:\n- Restore exercises/student-tools.ts to the listing-only template.\n- Move exercises/participant/ (optional challenge files) into a backup.\n- Preserve everything else, including assets, notes, configuration, and solutions.');
if (!apply) {
  console.log('Preview only; nothing changed. To apply: npm run workshop:reset -- --apply');
} else {
  const backup = await checkedPath(`.workshop-backups/${new Date().toISOString().replaceAll(':', '-')}-${randomUUID()}`);
  await mkdir(resolve(backup, 'exercises'), { recursive: true });
  for (const path of targets) {
    const source = await checkedPath(path);
    try { await lstat(source); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    // Moving into the backup clears the active exercise without deleting the work.
    await rename(source, resolve(backup, path));
  }
  await copyFile(template, resolve(root, 'exercises/student-tools.ts'));
  console.log(`Reset complete. Original work: ${backup}\nRun npm run build, then restart the MCP server. Do not reuse the previously compiled solution.`);
}
