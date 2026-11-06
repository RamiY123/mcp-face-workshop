import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools as completed } from '../solutions/tools.js';
import { registerTools as student } from '../exercises/student-tools.js';
const server = new McpServer({ name: 'mcp-face-workshop', version: '0.1.0' });
(process.env.WORKSHOP_MODE === 'starter' ? student : completed)(server);
await server.connect(new StdioServerTransport());
