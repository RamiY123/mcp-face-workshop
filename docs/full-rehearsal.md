# Participant checks and exact reset scope

Main is the official participant clone. No nested starter is needed. Instructor solutions are maintained separately and must not be retrieved by participant agents.

## Check progress

1. Install dependencies and build.
2. Install Chromium with `npx playwright install chromium`.
3. Run `npm run verify` for baseline server, viewer, listing, and reset checks.
4. Create your client configuration; run `npm run check:connection -- copilot` or `claude` to launch it and call the list tool.
5. Implement set/reset and run `npm run test:acceptance`. No solution files are injected.
6. Verify real calls in your client: list, shocked, reset, close/reopen viewer, stop/restart app. Report accepted versus displayed accurately.

## Reset

Stop only this checkout's MCP process. Preview and then apply:

```sh
npm run workshop:reset
npm run workshop:reset -- --apply
npm run build
```

To include the connection exercise:

```sh
npm run workshop:reset -- --include-client-config
npm run workshop:reset -- --include-client-config --apply
npm run build
```

Restart MCP after rebuilding. Already-running processes retain old code. Only list_expressions should remain until the next implementation.

| Path | Action |
| --- | --- |
| exercises/student-tools.ts | Back up and restore the listing-only template. |
| exercises/participant/ | Move optional challenge files into backup. |
| .vscode/mcp.json and .mcp.json | Only with --include-client-config: back up originals and remove only face-workshop entries. Preserve other servers/settings. If nothing remains, no active file is left. |
| Everything else | Preserve: notes, assets, manifest edits, other code, .codex/config.toml, and all external configuration. |

The script prints a unique `.workshop-backups/` directory before moving work. It rejects non-participant editions and symlink/junction targets. Invalid JSON prevents a full reset before any exercise changes; fix the file instead of bypassing the guard. Server entries with other names are not removed.

Preview makes no changes. `--apply` explicitly applies the reset. No Git reset/clean or branch fetch occurs. Recover only your own backup files after comparing with newer work. The workshop-rehearsal skill routes to this workflow; the instructor's solution-injecting rehearsal is not shipped on main.
