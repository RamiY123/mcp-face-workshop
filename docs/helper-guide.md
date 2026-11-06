# Workshop helper

Use this guide to prepare, run, connect, diagnose, or teach this repository. Start by establishing whether the user is in the completed demo or the generated starter. Do not automatically fill in exercises for a student.

## Prepare and run

1. Inspect local changes before edits. Check Node 22.12+, npm and Git.
2. Run `npm ci`, `npm run build`, then `npm run doctor`.
3. Start `npm start` in a terminal that stays open. Open http://127.0.0.1:3333 and verify Connected.
4. Try a manual expression, then follow the appropriate guide under `docs/client-setup/`.
5. Ask the assistant to list expressions and set one. Verify the actual tool result and browser, not just the assistant's prose.

The helper may install project dependencies and run project commands when requested. Ask before overwriting student work, replacing checkpoints, or changing configuration outside this repository. Do not reset Git or discard changes to recover.

## Diagnose

| Symptom | Check / action |
| --- | --- |
| PowerShell blocks npm.ps1 | Use `npm.cmd`. No execution-policy change needed. |
| `dist` missing / MCP exits | Run `npm run build`; use `node dist/mcp/index.js`, not a Vite command, for MCP. |
| Port in use | Check the existing process; use another FACE_PORT in both app and MCP configuration. Do not kill unrelated processes. |
| Accepted but not displayed | Open the viewer, check Connected, inspect assets and foreground the tab. |
| No tools in chat | Check workspace trust, server trust, tool selection, account access, build path and MCP logs; restart the configured MCP server. |
| Changes not reflected | Rebuild, restart the HTTP app and MCP server, reload the viewer. |
| Missing asset | Read the manifest, verify each path and filename; see docs/assets.md. |
| Network install fails | Retry `npm ci`; inspect the reported registry/proxy error. Do not disable TLS checks. |
| Tests fail in starter | Expected for missing set/reset; read exercises/README.md and implement incrementally. |

## Teach and recover

Give one hint first, then a more specific explanation, then the full solution only on request. Use the hints in `exercises/README.md`. Run tests after meaningful changes and explain failures in terms of request flow.

Before recovery, copy the student's edited `exercises/student-tools.ts` to a new backup filename. With permission, compare against `solutions/tools.ts` and restore only the needed registrations. Keep their work and discuss the missing concept. Never claim a client integration was tested if only SDK tests ran.
