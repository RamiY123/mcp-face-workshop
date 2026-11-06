import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', fullyParallel: false, workers: 1,
  use: { baseURL: 'http://127.0.0.1:3344', headless: true },
  webServer: { command: 'node dist/server/index.js', env: { FACE_PORT: '3344' }, url: 'http://127.0.0.1:3344/api/health', reuseExistingServer: false }
});
