# Verification record

Local verification passed on 6 November 2026 on Windows with Node 24.20.0 and npm 11.19.0: production build, all five server/protocol tests, and all three Chromium browser tests. Desktop and mobile screenshots were visually reviewed. Both helper skills passed schema validation. A separate generated starter passed npm ci, build, and a real stdio check confirming its single working listing tool and six presets. See the repository's GitHub Actions runs for independent clean-checkout Windows and Linux results; merely providing a workflow is not proof it has passed.

Automated coverage includes the production build, actual MCP stdio tool discovery/calls, input validation, reset, HTTP outage reporting, disconnected viewer semantics, same-origin restrictions, SSE state restoration, manual browser controls, real MCP-to-browser display acknowledgements, missing-image non-acknowledgement, and responsive layout. The browser screenshots use temporary SVG assets.

The complete demo is the default. The generated student starter deliberately omits two tool registrations, so full acceptance tests fail until those exercises are completed. Setup/build and the working list tool must still succeed in the starter.

Not yet verified: an authenticated Copilot conversation, an authenticated Claude Code conversation, final realistic portrait assets, classroom timing, and student account allowances. A Claude Code VS Code extension was found locally; a Claude CLI executable was not found on PATH. SDK tests do not substitute for the client rehearsal.

Final local results and CI status are recorded in the implementation delivery message. Re-run `npm run verify` after changes.

## Full student lifecycle rehearsal

On 6 November 2026, the instructor exercise-cycle rehearsal passed all ten lifecycle checks plus five server/protocol and three Chromium tests. This workflow is preserved on presenter/complete. It exercises a legacy isolated fixture, not the official main distribution. The reset preview, backup integrity, preservation of notes, repeated reset, edition guard, and external-junction refusal were exercised. A fresh MCP process exposed only list_expressions after reset.

After the branch split, the official participant main was independently tested from a fresh shallow clone: clean installation, build, distribution check, 12 baseline protocol/server/reset/configuration tests, and three browser tests passed. Both Windows and Linux GitHub CI passed for [participant main](https://github.com/RamiY123/mcp-face-workshop/actions/runs/42220661290) and [presenter complete](https://github.com/RamiY123/mcp-face-workshop/actions/runs/42219625524). These results do not claim an authenticated assistant conversation or final portrait approval.
