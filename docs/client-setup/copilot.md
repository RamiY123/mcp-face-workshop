# Exercise: connect Copilot

Install VS Code, enable Copilot Chat, sign in, and open this repository folder. Review workspace trust. Build and start the viewer.

Create `.vscode/mcp.json` yourself using the official reference below. Use a top-level `servers` object, a `face-workshop` entry, type `stdio`, command `node`, and an `args` array containing the compiled MCP entry. Use the `workspaceFolder` substitution for portability. The target filename is `dist/mcp/index.js`.

Run `npm run check:connection -- copilot`. Then use **MCP: List Servers** to start/trust the server, enable its tools in chat, and call `list_expressions`. Rebuild and restart MCP after editing tools. The initial absence of set/reset is intentional.

[Official configuration reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration). Ask for hints based on your files, not presenter answers.
