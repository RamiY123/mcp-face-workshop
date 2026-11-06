import { baseUrl } from '../shared/config.js';
export async function requestExpression(name: string) {
  try {
    const response = await fetch(`${baseUrl()}/api/expression`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, source: 'mcp' }), signal: AbortSignal.timeout(4000)
    });
    const result = await response.json() as Record<string, unknown>;
    if (!response.ok) throw new Error(String(result.error ?? response.statusText));
    return result;
  } catch (error) {
    throw new Error(`Face update failed: ${(error as Error).message}. Start the app with npm start; check FACE_PORT and npm run doctor.`);
  }
}
