import { createApp } from './app.js';
import { portFromEnv } from '../shared/config.js';
const port = portFromEnv();
const server = createApp().listen(port, '127.0.0.1', () => console.log(`Face viewer: http://127.0.0.1:${port}`));
server.on('error', error => { console.error(`Cannot start viewer: ${error.message}. Check FACE_PORT or run npm run doctor.`); process.exitCode = 1; });
