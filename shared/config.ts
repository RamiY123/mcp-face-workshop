import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
// Both source execution and compiled dist/shared execution resolve the repository root.
export const root = fileURLToPath(new URL(import.meta.url.includes('/dist/') ? '../../' : '../', import.meta.url));
export const assetDirectory = resolve(root, 'assets/expressions');
export function portFromEnv(): number {
  const port = Number(process.env.FACE_PORT ?? 3333);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('FACE_PORT must be an integer from 1 to 65535');
  return port;
}
export const baseUrl = () => `http://127.0.0.1:${portFromEnv()}`;
