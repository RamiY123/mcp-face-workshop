import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
let failures = 0;
function report(ok, message) { console.log(`${ok ? 'OK' : 'FAIL'}  ${message}`); if (!ok) failures++; }
const [major, minor] = process.versions.node.split('.').map(Number);
report(major > 22 || (major === 22 && minor >= 12), `Node ${process.versions.node} (requires 22.12+)`);
for (const path of ['node_modules', 'dist/server/index.js', 'dist/mcp/index.js', 'dist/web/index.html']) {
  try { await access(resolve(root, path)); report(true, path); }
  catch { report(false, `${path} missing. Run npm ci then npm run build.`); }
}
const manifest = JSON.parse(await readFile(resolve(root, 'assets/expressions/manifest.json'), 'utf8'));
for (const expression of manifest.expressions) {
  try { await access(resolve(root, 'assets/expressions', expression.asset)); report(true, `asset ${expression.id}`); }
  catch { report(false, `Missing ${expression.asset}`); }
}
if (manifest.temporary) console.log('NOTE  Development placeholders; final realistic portrait still required.');
const port = Number(process.env.FACE_PORT ?? 3333);
try {
  const response = await fetch(`http://127.0.0.1:${port}/api/health`, { signal: AbortSignal.timeout(2000) });
  const health = await response.json();
  report(response.ok && health.ok === true && typeof health.viewers === 'number', `App on port ${port}, ${health.viewers} viewer(s)`);
  if (!health.viewers) console.log(`NOTE  Open http://127.0.0.1:${port} before checking display confirmations.`);
} catch { console.log(`NOTE  App not reachable on port ${port}. Start it with npm start.`); }
process.exitCode = failures ? 1 : 0;
