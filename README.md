# Xperience · Give your assistant a face

**main is the official participant starter.** Clone it and work directly in the repository. Create your assistant connection, implement expression tools, and see the results in the prepared browser viewer.

## Prepare

Install Node.js 22.12+ (Node 24 recommended), Git, and your chosen client: VS Code with Copilot or Claude Code. Sign in and check account/tool access. Connecting MCP is the first exercise, not a prerequisite.

```sh
git clone --branch main --single-branch --depth 1 https://github.com/RamiY123/mcp-face-workshop.git
cd mcp-face-workshop
npm ci
npm run build
npm start
```

Open **http://127.0.0.1:3333** and try the manual buttons. Leave that terminal running; use another for `npm run doctor`. On PowerShell, use `npm.cmd` if `npm.ps1` is blocked. No database, Docker, GPU, or Python runtime is required.

## Start the lab

Read [the exercises](exercises/README.md). Client configurations are deliberately absent. `list_expressions` is the working example; implement `set_expression` and `reset_expression` in `exercises/student-tools.ts`. There is no completed solution directory or hidden solution mode on this branch.

- [Copilot connection exercise](docs/client-setup/copilot.md)
- [Claude connection exercise](docs/client-setup/claude.md)
- [Architecture](docs/architecture.md)
- [Hints and troubleshooting](docs/helper-guide.md)
- [Reset scope and backups](docs/full-rehearsal.md)

Agent instructions prohibit copying answers from presenter branches, Git history, remotes, or other checkouts. Ask for hints and explanations based on your own work. The instructor keeps a separate complete demo; it is not the participant starting point.

## Check progress

```sh
npx playwright install chromium
npm run verify
```

Baseline verification passes before the exercises: prepared viewer, listing, HTTP behavior, and reset safety. After writing your configuration, run `npm run check:connection -- copilot` (or `claude`). After implementing both tools, run `npm run test:acceptance` for complete MCP-to-browser checks. Acceptance tests intentionally fail before implementation.

`npm run check:starter` is a distribution/CI check for untouched starters. It is expected to fail after creating configuration or editing the exercise; it is not a student progress grade.

## Reset

Preview with `npm run workshop:reset`, then add `-- --apply` to restore the initial tool exercise with backups. To also repeat the connection exercise, preview `npm run workshop:reset -- --include-client-config`, then add `--apply`. Unrelated client entries are preserved. Rebuild and restart MCP afterward. See the reset guide for exact scope.

Default port: 3333. If changing it, set `FACE_PORT` consistently in the app and MCP environment. State survives browser refresh; app restart resets to neutral.

The 12 images are expressive illustrated demo assets, including angry, happy, laughing, sad, sleepy, and love. Final realistic portraits and personal-face uploads remain future work. Expressions represent selected reactions, not experienced feelings. Code and original SVGs are MIT; the Xperience logo remains its owner's brand asset (see `web/public/branding/README.md`).
