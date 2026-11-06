import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools } from '../exercises/student-tools.js';
const server = new McpServer({ name: 'mcp-face-workshop', version: '0.1.0' });
registerTools(server);
await server.connect(new StdioServerTransport());
