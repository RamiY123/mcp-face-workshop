# Student lab

Start from the isolated copy made by `npm run workshop:starter`. In that copy run `npm ci`, `npm run build`, and `npm start`. Connect your assistant client. `list_expressions` is your working example; edit `exercises/student-tools.ts`. Rebuild and restart MCP after each edit.

## 1 — Read the path (15 minutes)

Call `list_expressions`. Locate the manifest and tool registration. Explain which process runs the tool and why browser SSE is not MCP stdio. Change one description, rebuild, restart MCP, and check the listing.

## 2 — Set a reaction (25 minutes)

Register `set_expression` with a required, validated `name`. Use the manifest's IDs and `requestExpression` from `mcp/commands.ts`. Return an MCP text content result containing the server response. Catch runtime errors and mark results `isError: true`.

Acceptance: a valid expression changes the browser; an invalid ID fails without changing state; a closed viewer returns accepted_no_viewer instead of claiming display.

Hint 1: look at how list_expressions registers its callback and returns content.

Hint 2: Zod can describe an enum of manifest IDs. The SDK validates arguments before your callback. HTTP failures still need handling inside the callback.

## 3 — Reset and recover (25 minutes)

Register `reset_expression` with no arguments. Reuse your change path with neutral. Stop the app and call set_expression: the error should tell you how to restart it. Refresh the browser after an update and explain why state is restored.

Hint 1: reset is a special case of changing the expression.

Hint 2: `requestExpression('neutral')` uses the same HTTP and acknowledgement flow. Do not report success from a catch block.

Run `npm run build` and `npm test`. After installing the browser with `npx playwright install chromium`, run `npm run test:e2e`. The complete suite expects all three tools, so it intentionally fails while exercises are incomplete.

## 4 — Pair challenge (20 minutes)

Choose one: add a seventh expression and its asset; add a timed return to neutral that does not overwrite a newer command; or add a bounded expression sequence. Define expected behavior before coding. Test interrupted sequences or overlapping commands. Intensity is meaningful only if your assets actually support it.

## Recovery

The completed registrations are in `solutions/tools.ts`. Ask for a hint before opening the full answer. To recover, first save a copy of your student file, then compare and selectively restore the missing code. An instructor may copy the full solution into `exercises/student-tools.ts` when you request it; import paths match. The original demo outside the starter remains usable throughout.
