import { lstat, readFile, mkdir, rename, copyFile, writeFile } from 'node:fs/promises';
import { resolve, relative, isAbsolute, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const apply = process.argv.includes('--apply');
const includeConfig = process.argv.includes('--include-client-config');
if (process.argv.slice(2).some(arg => !['--apply', '--include-client-config'].includes(arg))) throw new Error('Usage: npm run workshop:reset [-- --include-client-config] [--apply]');

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
const packagePath = await checkedPath('package.json');
const metadata = JSON.parse(await readFile(packagePath, 'utf8'));
if (metadata.name !== 'mcp-face-workshop' || metadata.workshopRole !== 'participant') throw new Error('Reset only runs in the participant edition on main; refusing this checkout.');
const template = await checkedPath('scripts/templates/student-tools.ts.txt');
await readFile(template, 'utf8');
for (const path of targets) await checkedPath(path);
await checkedPath('.workshop-backups');
const configEdits = [];
if (includeConfig) {
  for (const [path, key] of [['.vscode/mcp.json', 'servers'], ['.mcp.json', 'mcpServers']]) {
    const full = await checkedPath(path);
    let raw;
    try { raw = await readFile(full, 'utf8'); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    let data;
    try { data = JSON.parse(raw); } catch { throw new Error(`Cannot safely edit ${path}: invalid JSON. Fix it before a full reset. Nothing has been reset.`); }
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(`Expected an object in ${path}`);
    if (data[key] && Object.hasOwn(data[key], 'face-workshop')) {
      delete data[key]['face-workshop'];
      if (Object.keys(data[key]).length === 0) delete data[key];
      configEdits.push({ path, full, data });
    }
  }
}
console.log('Reset scope:\n- Restore exercises/student-tools.ts to the listing-only template.\n- Move exercises/participant/ (optional challenge files) into a backup.\n- Preserve assets, notes, other code, and unrelated client servers.');
console.log(includeConfig ? `- Back up and remove only face-workshop from Copilot/Claude project JSON configurations (${configEdits.length} file(s)). Empty workshop-only files are moved to backup.` : '- Preserve client configurations (use --include-client-config to reset the connection exercise too).');
if (!apply) {
  console.log(`Preview only; nothing changed. To apply: npm run workshop:reset -- ${includeConfig ? '--include-client-config ' : ''}--apply`);
} else {
  const backup = await checkedPath(`.workshop-backups/${new Date().toISOString().replaceAll(':', '-')}-${randomUUID()}`);
  await mkdir(resolve(backup, 'exercises'), { recursive: true });
  console.log(`Backup destination: ${backup}`);
  for (const path of targets) {
    const source = await checkedPath(path);
    try { await lstat(source); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    // Moving into the backup clears the active exercise without deleting the work.
    await rename(source, resolve(backup, path));
  }
  await copyFile(template, resolve(root, 'exercises/student-tools.ts'));
  for (const edit of configEdits) {
    await mkdir(dirname(resolve(backup, edit.path)), { recursive: true });
    await rename(edit.full, resolve(backup, edit.path));
    if (Object.keys(edit.data).length) await writeFile(edit.full, JSON.stringify(edit.data, null, 2) + '\n');
  }
  console.log(`Reset complete. Original work: ${backup}\nRun npm run build, then restart the MCP server. Do not reuse the previously compiled solution.`);
}
