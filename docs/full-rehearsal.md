# Full rehearsal and participant reset

This is the **presenter/complete** rehearsal. It verifies the completed demo and an isolated legacy exercise fixture through actual MCP stdio and Chromium. It does not impersonate a signed-in assistant conversation or test the exact participant distribution. Participants clone **main**, whose own instructions cover baseline checks, connection exercises, acceptance tests, and reset scope.

## Use the skill

In Codex, invoke `$workshop-rehearsal`; in Claude Code, invoke `/workshop-rehearsal`; in Copilot, ask to use the workshop-rehearsal skill. Examples: “Run the full rehearsal in an isolated copy” or “Preview the participant reset in this generated starter.” For an actual reset, explicitly name the intended starter folder and ask to reset it. The skill routes to this document and uses the existing scripts. Its canonical entry point is `.agents/skills/workshop-rehearsal/SKILL.md`, with Claude and Copilot entry points included. If the client has not discovered the new skill yet, ask it to read that file directly.

## Run the complete automated rehearsal

From the repository root:

```sh
git switch presenter/complete
npm ci
npx playwright install chromium
npm run test:rehearsal
```

On PowerShell, use `npm.cmd` / `npx.cmd` if script execution policy blocks npm.ps1. Keep port 3344 free. The viewer you may already have open on port 3333 is unaffected.

The script creates a separate student copy in your operating system's temporary directory. It does not modify your existing `workshop-starter`, the original demo, or its branch. It tests:

1. Fresh starter generation and refusal to overwrite an existing destination.
2. Clean `npm ci` and production build.
3. MCP discovery and listing from the starter: only list_expressions exists.
4. Refusal to reset an unmarked demo, preserving its files.
5. A completed participant solution, then the full server, real stdio protocol, and browser acceptance suite. That suite verifies invalid inputs, reset, stopped server, disconnected viewer, display acknowledgements, missing images, refresh, reconnection, and mobile layout.
6. Reset preview with no changes to participant work.
7. Applied reset with byte-for-byte backup verification, removal of optional challenge files from the active exercise, and preservation of personal notes.
8. Rebuild after reset: only list_expressions is exposed again, confirming the compiled solution is no longer active.
9. Repeat reset with no optional challenge directory.
10. Refusal of a symbolic link/junction pointing outside the student folder, preserving the external work.

The reference solution is copied only inside the disposable rehearsal copy. This is an instructor acceptance test, not a helper that silently solves a student's exercise.

Results: `test-results/rehearsal.json` records each check and its outcome, the exact retained temporary workspace, and any failure. Browser screenshots are in that temporary student copy's `test-results/`. The workspace is retained for inspection and recovery; the script does not recursively delete it. A failed check produces a nonzero exit code. Install the test browser beforehand; the rehearsal does not silently download browsers.

## Instructor-only fixture

The legacy `npm run workshop:starter` command creates an instructor-only `workshop-starter/` fixture and refuses to overwrite an existing directory. It contains prepared client configurations and solutions, so do not distribute it to participants. Preserve existing folders; do not add markers to bypass reset guards.

For the actual workshop, send students the main-branch clone commands and instructions. They create their client configuration and implement missing tools there. The reset commands below apply only to this presenter branch's legacy fixture; main documents its separate reset behavior, including the optional connection reset.

## Clear participant additions and restart the exercises

Stop the starter's MCP process before resetting. In **the generated starter directory**, run:

```sh
npm run workshop:reset
```

That command only previews the exact scope. To apply it:

```sh
npm run workshop:reset -- --apply
npm run build
```

Restart the MCP server in the client. A running process continues using its old code until restarted. Use list_expressions and check tool discovery: set_expression and reset_expression should be absent until implemented again.

| Path | Reset action |
| --- | --- |
| `exercises/student-tools.ts` | Move original into backup, restore the listing-only template. |
| `exercises/participant/` | Move the entire optional challenge directory into backup, if present. |
| Everything else | Preserve, including notes, face assets, configuration, solutions, and Git history. |

The script reports the unique backup directory under `.workshop-backups/`. It clears the active exercise by moving work into that backup, rather than permanently deleting it. It rejects unmarked demos and symlink/junction targets. It accepts no arbitrary deletion paths and runs no Git reset/clean commands. There is no prompt: `--apply` is the explicit action. To recover, inspect the printed backup, copy only the desired files back, rebuild, and restart MCP. Avoid overwriting newer work during restoration.

Changes to the manifest, other source files, or files outside `exercises/participant/` are intentionally preserved. If a clean environment is needed after broader changes, keep the old folder and generate another starter from an unchanged demo checkout.

## Live assistant conversation acceptance (manual)

After the automated rehearsal, run the completed demo and open its viewer beside the chosen chat client. Follow the relevant guide in `docs/client-setup/`. For each client, record the client version, test date, actual tool results, and observations:

| Prompt / action | Expected evidence |
| --- | --- |
| “Call list_expressions and show the available IDs.” | Actual tool call, all manifest IDs. |
| “Call set_expression with shocked.” | Tool result displayed:true and shocked image in the viewer. |
| “Call reset_expression.” | Neutral image and confirmed display. |
| Close viewer, request wink. | accepted_no_viewer; assistant does not claim it was displayed. |
| Reopen viewer. | Current wink image restored. |
| Stop app, request smug. | Useful tool error telling you to start the app. |
| Restart app and request confused. | Normal confirmed display resumes. |

Do not disable client approvals to force a test through. A client may refuse to call a schema-invalid tool; automated protocol tests cover invalid IDs directly. Passing this script does not mark Copilot, Claude, or this chat's native tool integration as tested. Those require an actual connected, authenticated client session. Final realistic portrait approval and classroom timing remain separate checks.
