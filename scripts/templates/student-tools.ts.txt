import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { result } from '../solutions/tools.js';
import { manifest } from '../shared/manifest.js';
// The starter keeps one working example. Follow exercises/README.md to add the other tools.
export function registerTools(server: McpServer) {
  server.registerTool('list_expressions', { description: 'List face reactions', inputSchema: {} }, async () => result(manifest));
  // Exercise 1: register set_expression with a validated name, using requestExpression.
  // Exercise 2: register reset_expression and return understandable error results.
}
