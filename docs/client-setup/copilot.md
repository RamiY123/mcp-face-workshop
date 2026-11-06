# GitHub Copilot in VS Code

1. Install current VS Code and enable GitHub Copilot Chat with an account that can use agent tools. Open this repository as the workspace and review workspace trust.
2. Run `npm ci`, `npm run build`, and `npm start`; open the viewer.
3. Review `.vscode/mcp.json`. It launches `node` with `${workspaceFolder}/dist/mcp/index.js` over stdio. No API key is needed for this server.
4. Use **MCP: List Servers** from the Command Palette, select `face-workshop`, and start it. Review the server trust prompt. If a command label has changed in your VS Code release, open the MCP configuration and use its server actions.
5. Open agent chat and enable the face tools through tool selection. Ask: “Call list_expressions, then call set_expression with shocked.” Check both the result and the viewer.
6. Ask: “Reset the face to neutral.” Verify reset_expression is called.

`.github/copilot-instructions.md` supplies shared project guidance; `.github/skills/workshop-helper/SKILL.md` provides the setup helper. If automatic skill discovery is unavailable, ask the assistant to read `docs/helper-guide.md` directly. Rebuild and restart the MCP server after editing tools.

Configuration verified against [VS Code's MCP reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration) and [agent skills documentation](https://code.visualstudio.com/docs/agent-customization/agent-skills). A signed-in Copilot conversation must still be rehearsed on the instructor machine.
