# Claude Code

Start Claude Code from this repository root so `.mcp.json` and its relative launch path resolve correctly. Install and sign in to Claude Code separately; the workshop does not supply an account or usage allowance.

1. Run `npm ci`, `npm run build`, and `npm start` in the repository; open the viewer.
2. Review `.mcp.json`. It defines `face-workshop` using the command `node` and argument `dist/mcp/index.js`.
3. Start `claude` from this directory. Review the project MCP approval prompt; use `/mcp` to inspect server status and tools.
4. Ask: “List the face expressions, then set the face to wink.” Approve the call if prompted and observe the viewer.
5. Ask for a reset and verify the neutral image.

If using the Claude Code VS Code extension, open this exact repository folder and inspect its MCP status. Do not assume installing the extension places the `claude` executable on PATH.

`CLAUDE.md` routes to shared guidance. `.claude/skills/workshop-helper/SKILL.md` offers the workshop helper; ask for `/workshop-helper` or ask Claude to read `docs/helper-guide.md`. Restart the MCP server after rebuilding edited tools.

References: [Claude MCP configuration and project scopes](https://code.claude.com/docs/en/mcp), [Claude skills](https://code.claude.com/docs/en/skills). Configuration has been reviewed; a signed-in Claude session remains a separate rehearsal check.
