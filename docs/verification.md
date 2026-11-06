# Verification record

Local verification passed on 6 November 2026 on Windows with Node 24.20.0 and npm 11.19.0: production build, all five server/protocol tests, and all three Chromium browser tests. Desktop and mobile screenshots were visually reviewed. Both helper skills passed schema validation. A separate generated starter passed npm ci, build, and a real stdio check confirming its single working listing tool and six presets. See the repository's GitHub Actions runs for independent clean-checkout Windows and Linux results; merely providing a workflow is not proof it has passed.

Automated coverage includes the production build, actual MCP stdio tool discovery/calls, input validation, reset, HTTP outage reporting, disconnected viewer semantics, same-origin restrictions, SSE state restoration, manual browser controls, real MCP-to-browser display acknowledgements, missing-image non-acknowledgement, and responsive layout. The browser screenshots use temporary SVG assets.

The complete demo is the default. The generated student starter deliberately omits two tool registrations, so full acceptance tests fail until those exercises are completed. Setup/build and the working list tool must still succeed in the starter.

Not yet verified: an authenticated Copilot conversation, an authenticated Claude Code conversation, final realistic portrait assets, classroom timing, and student account allowances. A Claude Code VS Code extension was found locally; a Claude CLI executable was not found on PATH. SDK tests do not substitute for the client rehearsal.

Final local results and CI status are recorded in the implementation delivery message. Re-run `npm run verify` after changes.

## Full student lifecycle rehearsal

On 6 November 2026, `npm run test:rehearsal` passed locally on the `workshop/full-rehearsal` branch: all ten lifecycle checks plus the five server/protocol and three Chromium tests inside the completed student copy. The reset preview, backup integrity, preservation of unrelated notes, repeated reset, refusal of unmarked copies, and refusal of an external junction were exercised. Rebuilt reset code exposed only list_expressions through a fresh MCP stdio process. See [the reproducible procedure and exact reset scope](full-rehearsal.md). This result does not claim a signed-in assistant conversation was tested.
