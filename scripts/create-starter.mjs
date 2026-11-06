import { createStarter } from './workshop-files.mjs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const target = resolve(root, 'workshop-starter');
await createStarter(root, target);
console.log(`Starter created at ${target}. Run npm ci and npm run build inside it. Edit exercises/student-tools.ts. The full demo remains unchanged.`);
