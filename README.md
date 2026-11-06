# Give your assistant a face

**Presenter edition — `presenter/complete`.** This branch contains the completed demo, client configurations, solutions, and instructor rehearsal tools. Participants clone `main`, which is the official learning starter. Do not distribute this branch as their starting point.

A two-hour, hands-on MCP workshop for final-year students. An assistant calls three local tools; a browser viewer shows the selected reaction immediately.

**Status:** working application with 12 expressive illustrated reactions, including angry, happy, laughing, sad, sleepy, and love. The final realistic portrait assets are pending. No LivePortrait, GPU, Python, database, or cloud account is needed to run the student app.

## Quick start

Install Node.js 22.12+ (Node 24 recommended) and Git. Clone this repository, then run:

```sh
npm ci
npm run build
npm start
```

Open **http://127.0.0.1:3333**. Leave the terminal running. In another terminal, run `npm run doctor`. On PowerShell systems that block `npm.ps1`, use `npm.cmd` in place of `npm`.

Try the buttons, then connect [GitHub Copilot](docs/client-setup/copilot.md) or [Claude Code](docs/client-setup/claude.md). Example prompt: “List the available face expressions, then set the face to shocked.” Approve the tool when asked. The assistant must actually call the tool; ordinary chat text alone does not change the viewer.

## Verify

```sh
npm run build
npm test
npx playwright install chromium
npm run test:e2e
```

`npm run verify` runs the build, protocol/server tests, and browser tests together. Browser tests use a separate app on port 3344; keep that port free. They spawn a real MCP process over stdio and check browser display acknowledgements. See [verification status](docs/verification.md) for the distinction between automated tests and assistant-client rehearsal.

For the instructor's isolated exercise-cycle test, run `npm run test:rehearsal` or use the [workshop-rehearsal skill](.agents/skills/workshop-rehearsal/SKILL.md). See [presenter rehearsal instructions](docs/full-rehearsal.md). This command belongs to `presenter/complete`; main has its own participant baseline, connection, acceptance, and reset commands.

## Teach and learn

- [Student exercises and progressive hints](exercises/README.md)
- [Instructor plan and pre-work](docs/instructor.md)
- [Architecture and command status](docs/architecture.md)
- [Setup and troubleshooting helper](docs/helper-guide.md)
- [Assets, attribution, and portrait preparation](docs/assets.md)

This checkout is the completed presenter demo. Participants clone main directly and follow its exercises. The legacy `npm run workshop:starter` command here creates an instructor-only test fixture; it includes solution references and prepared configurations, so do not distribute it as the official participant starter. It refuses to overwrite an existing copy.

## Configuration

The viewer binds only to `127.0.0.1`. Default port: `3333`. To change it in PowerShell: `$env:FACE_PORT='3335'`, then `npm start`. Also set `FACE_PORT` to the same value in the MCP server's `env` configuration. Never place secrets in the repository. State is in memory: browser refresh restores the current reaction, while restarting the app resets to neutral.

Prepared still images change expressions; this version does not animate speech or lip-sync. Expressions represent conversational reactions, not feelings experienced by an assistant.

Code and original placeholder SVGs: MIT. The Xperience logo remains its owner's brand asset; see [branding attribution](web/public/branding/README.md). Any replacement portraits must have their own documented redistribution rights. See [visual design notes](docs/visual-design.md) for the viewer's Xperience styling.
