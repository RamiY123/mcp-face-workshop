import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { manifest } from '../shared/manifest.js';
import { requestExpression } from '../mcp/commands.js';
export const result = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
export async function change(name: string) {
  try { return result(await requestExpression(name)); }
  catch (error) { return { ...result({ error: (error as Error).message }), isError: true }; }
}
export function registerTools(server: McpServer) {
  server.registerTool('list_expressions', { description: 'List supported face reactions. These are selected expressions, not experienced emotions.', inputSchema: {} }, async () => result(manifest));
  server.registerTool('set_expression', {
    description: 'Request a face reaction. Only displayed:true confirms a browser loaded it. accepted_no_viewer means open the viewer first.',
    inputSchema: { name: z.enum(manifest.expressions.map(e => e.id) as [string, ...string[]]) }
  }, async ({ name }) => change(name));
  server.registerTool('reset_expression', { description: 'Return the face to neutral.', inputSchema: {} }, async () => change('neutral'));
}
