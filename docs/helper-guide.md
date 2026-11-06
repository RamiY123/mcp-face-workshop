# Participant helper

Read AGENTS.md first. Never obtain answers from presenter branches, old solution commits, remotes, other checkouts, or published reference solutions. Work from current participant code, requirements, tests, and official documentation. Give a conceptual hint, then a specific diagnostic, then a focused example when explicitly requested.

## Prepare and diagnose

Check Node 22.12+, npm, Git, client installation and sign-in. Run `npm ci`, `npm run build`, and `npm run doctor`. Start the viewer with `npm start`. Do not silently create client configuration during setup: that is exercise 1.

- PowerShell blocks npm.ps1: use npm.cmd.
- Missing dist: build before launching MCP.
- Missing config: expected before exercise 1; explain its fields.
- No tools in chat: run the appropriate check:connection command, then check trust, status, and tool selection in the client.
- Set/reset absent: expected before implementation. There is no solution-mode switch.
- Accepted but not displayed: open the viewer and inspect connectivity and assets.
- Port occupied: inspect its owner; do not stop unrelated processes. Set FACE_PORT consistently.
- Edits not reflected: rebuild and restart MCP.

## Verify and recover

`npm run verify` checks prepared functionality and passes before exercises. `npm run test:acceptance` checks completed tools and initially fails. `npm run check:connection -- copilot` or `claude` launches the actual participant-defined connection. These checks do not prove a signed-in conversation occurred.

For reset requests read docs/full-rehearsal.md, preview the intended scope, and apply the requested reset. Keep backups, notes, unrelated client entries, and external configuration. Never copy presenter answers or use Git reset/clean for recovery.
