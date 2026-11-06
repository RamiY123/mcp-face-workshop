# Verification boundaries

Main is the participant starter. Its default checks pass with no client configurations and only the supplied listing tool.

- `check:starter` verifies an untouched distribution has no completed configs or solutions. This is a CI/release check, not a progress grade after edits.
- `verify` builds and tests baseline HTTP behavior, listing, backup/reset safety, manual viewer controls, missing assets, and reconnects.
- `check:connection -- copilot|claude` reads the participant's JSON, validates the workshop's Node/stdio launch shape, starts that server, and calls list_expressions.
- `test:acceptance` checks completed set/reset behavior over real stdio and browser acknowledgements; it intentionally fails before implementation.

No check substitutes a presenter solution. SDK checks do not prove a signed-in conversation. Portrait review, client account access, and classroom timing remain separate checks.
