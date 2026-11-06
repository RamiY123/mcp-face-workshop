---
name: workshop-rehearsal
description: Run the MCP face workshop's full student rehearsal, preview or apply its participant reset, and verify the resulting MCP tools. Use for workshop reset scope and instructor acceptance checks, not ordinary student hints.
---

Read [the authoritative rehearsal and reset instructions](../../../docs/full-rehearsal.md). Resolve commands from the intended repository or generated starter, not from this skill directory.

## Rehearse

Run `npm run test:rehearsal` from the demo checkout after dependency/browser setup. The script creates an isolated student copy, applies the reference solution only there, tests MCP and browser behavior, resets it, and checks that only list_expressions remains. Read `test-results/rehearsal.json`; report failures and retained workspace paths accurately. Do not reset an existing participant workspace merely to run a rehearsal.

## Reset participant work

Establish the exact generated starter folder and inspect local changes. Run `npm run workshop:reset` there to preview scope. If the user requested a reset of that folder, apply it with `npm run workshop:reset -- --apply`; a request for instructions or a preview alone does not authorize applying it. If the target is ambiguous, ask which starter they mean before applying.

The only reset targets are `exercises/student-tools.ts` (restore the listing-only template) and `exercises/participant/` (clear optional challenge files). The script moves existing work to a unique `.workshop-backups/` folder. Preserve all other files. Never broaden the scope, bypass the marker or symlink guards, or use Git clean/reset as a substitute. For an old unmarked starter, preserve it and generate a fresh copy instead.

Report the actual backup path. Rebuild and restart the affected MCP process so previously compiled solution tools are not still active; do not stop unrelated processes. Verify discovery lists only list_expressions. Restore backups only on request, inspecting newer work before overwriting it.

## Evidence

Distinguish accepted commands from displayed:true acknowledgements. Distinguish SDK protocol/browser verification from native chat-client tool calls; never mark Copilot, Claude, or Codex conversation testing complete merely because scripted tests pass. Use the manual checklist in the shared instructions for a connected client.
