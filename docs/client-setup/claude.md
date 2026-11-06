# Exercise: connect Claude Code

Install/sign in to Claude Code and start it from the repository root. Build, start the app, and open the viewer. The VS Code extension alone does not guarantee a CLI executable on PATH.

Create `.mcp.json` yourself using the reference below. Use a top-level `mcpServers` object, a `face-workshop` entry, type `stdio`, command `node`, and an `args` array containing `dist/mcp/index.js`. The relative argument depends on starting Claude in the repository root.

Run `npm run check:connection -- claude`, review the project approval prompt, and inspect status with `/mcp`. Ask for `list_expressions` and check its actual result. Rebuild and restart MCP after edits. The initial absence of set/reset is intentional.

[Official MCP documentation](https://code.claude.com/docs/en/mcp). Ask for hints based on your files, not presenter answers.
