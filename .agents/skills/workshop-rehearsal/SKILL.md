---
name: workshop-rehearsal
description: Check progress or safely preview and reset this participant MCP workshop with backups. Use for reset scope and participant verification, not obtaining instructor solutions.
---

Read [AGENTS.md](../../../AGENTS.md) and [the check/reset guide](../../../docs/full-rehearsal.md). Do not retrieve presenter branches, old solution commits, remotes, or other completed checkouts. Never inject a reference implementation to pass tests.

Run npm run verify for the prepared baseline. Help participants create their own configuration, then use npm run check:connection -- copilot or claude. Use npm run test:acceptance to check their completed tools. Explain failures as learning checkpoints.

For reset, establish the exact participant checkout and preview npm run workshop:reset. Default targets are exercises/student-tools.ts and exercises/participant/. Add --include-client-config only when resetting the connection exercise was requested: it backs up project JSON files and removes only face-workshop entries, preserving other settings. It does not change .codex/config.toml or external configuration.

Apply with --apply only for a requested reset, not a preview/instructions request. Do not bypass edition or symlink guards. Report backups, rebuild, and restart only the affected MCP process. Verify only list_expressions remains. Restore the student's own backups when requested, preserving newer work.

Distinguish accepted from displayed and SDK/browser checks from native signed-in client calls. Give progressive hints from current work rather than silently solving the lab.
