import { readFileSync, accessSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';
import { assetDirectory } from './config.js';
const schema = z.object({
  temporary: z.boolean(), credit: z.string(),
  expressions: z.array(z.object({ id: z.string().regex(/^[a-z_]+$/), label: z.string(), description: z.string(), asset: z.string().regex(/^[a-zA-Z0-9_-]+\.(svg|png|jpg|jpeg|webp)$/) })).min(1)
});
export const manifest = schema.parse(JSON.parse(readFileSync(resolve(assetDirectory, 'manifest.json'), 'utf8')));
if (new Set(manifest.expressions.map(e => e.id)).size !== manifest.expressions.length) throw new Error('Duplicate expression IDs');
if (!manifest.expressions.some(e => e.id === 'neutral')) throw new Error('Manifest requires neutral');
export function checkAssets() {
  for (const expression of manifest.expressions) {
    try { accessSync(resolve(assetDirectory, expression.asset)); }
    catch { throw new Error(`Missing asset: ${expression.asset}. See docs/assets.md.`); }
  }
}
