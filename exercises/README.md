# Participant lab

Work directly in your clone of main. Do not use presenter branches or old solution commits. The viewer, HTTP server, stdio bootstrap in `mcp/index.ts`, and `list_expressions` are supplied examples so you can focus on the MCP connection and tools.

## 1 — Connect your assistant (15 minutes)

Read your client guide in `docs/client-setup/`. Create its project configuration yourself. Name the server `face-workshop`, choose stdio, launch Node, and point to the compiled MCP entry in this checkout. Explain why this is a separate process from `npm start`.

- Copilot: create `.vscode/mcp.json`.
- Claude: create `.mcp.json` at the repository root.

Create only the configuration for the client you use. These files are ignored by Git. Build, then run `npm run check:connection -- copilot` or `npm run check:connection -- claude`. That check reads your actual configuration and starts its server. Enable/trust it in your client, then call `list_expressions` through chat.

Checkpoint: explain the configuration's top-level key, server name, command, arguments, and transport. Show an actual tool result, not just assistant prose.

Hint 1: the browser URL is not the MCP transport here.

Hint 2: the compiled entry is `dist/mcp/index.js`; plain Node is not launching source TypeScript here.

## 2 — Trace the working example (10 minutes)

Follow the listing call through `mcp/index.ts`, `exercises/student-tools.ts`, and the manifest. Explain registration and the text-content envelope in `shared/result.ts`. Identify the stdio startup code and explain why stdout logging would corrupt the protocol.

## 3 — Implement set_expression (25 minutes)

Register the tool in `exercises/student-tools.ts`. Require a validated name based on manifest IDs. Use `requestExpression` from `mcp/commands.ts` and return its status in MCP content. Return `isError: true` for runtime failures.

Checkpoint: valid IDs change the viewer; invalid IDs preserve state; a disconnected viewer never produces a false display claim.

Hint 1: use the list registration as a structural example.

Hint 2: Zod can express allowed IDs. Schema errors occur before the callback; HTTP failures need handling inside it.

## 4 — Reset and diagnose (25 minutes)

Register `reset_expression` with no arguments and reuse your change path for neutral. Stop the app and explain the resulting tool error. Reopen the viewer after a command and check restored state. Rebuild and restart MCP after edits.

Checkpoint: run `npm run test:acceptance`. It tests your actual tools over stdio and browser acknowledgements. No answer implementation is substituted.

## 5 — Pair challenge (20 minutes)

Add an expression, a timed reset that cannot overwrite newer commands, or a bounded sequence. Put new optional modules in `exercises/participant/` and import them from your tool file. Keep personal notes elsewhere. Manifest and asset edits are outside the automatic reset scope.

## Recover

Preview `npm run workshop:reset`; add `--include-client-config` to repeat connection setup too. Apply when ready, rebuild, and restart MCP. Original work goes into `.workshop-backups/`. Inspect your own backups or ask for hints; do not recover by copying presenter answers. Full instructions are in `docs/full-rehearsal.md`.
