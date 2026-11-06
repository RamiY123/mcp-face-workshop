# Instructor runbook

## Branch roles

Use `presenter/complete` for the completed demo and instructor-only solution references. Participants clone `main` directly; do not ask them to generate a nested starter from this branch. The legacy starter/rehearsal commands here test the completed demo's isolated exercise cycle, not the exact contents of the new main branch.

On main, agents must not retrieve answers from this branch, older solution-bearing history, remote refs, other checkouts, or the former workshop/full-rehearsal branch. This preserves configuration, debugging, and implementation practice. Instructor maintenance can compare branches only when explicitly requested by the instructor. A public branch is not an access-control boundary; the rule is a teaching constraint.

## Before class

Finish the realistic assets, document their redistribution rights, and visually approve all six. Rehearse both supported clients with the actual student account/access tier. Prepare a screen with chat beside the viewer. Confirm the presenter demo and a fresh main clone install on a clean machine. Rehearse the timing; automated tests are not a two-hour classroom rehearsal.

Send students: Node 22.12+ and Git requirements, repository URL, chosen client installation/sign-in instructions, and the pre-work commands from main's README. Before class they should open the viewer and try its buttons. Creating the client configuration and making the first MCP call happen during class. They need sufficient assistant usage allowance. Browser-test downloads are optional during class if already completed beforehand.

Participants clone main directly:

```sh
git clone --branch main --single-branch --depth 1 https://github.com/RamiY123/mcp-face-workshop.git
```

Keep your completed demo on presenter/complete. Do not distribute a generated legacy fixture or switch a participant to the presenter branch to resolve an exercise. Use main's hints and the student's own backups for recovery.

| Minutes | Activity |
| --- | --- |
| 0–10 | Show a humorous conversation and three deliberate face tool calls. |
| 10–25 | Explain host/client/server/tools and trace the supplied listing example. |
| 25–40 | Students write their client configuration, check it, and call list_expressions. |
| 40–65 | Implement set_expression and validation. |
| 65–90 | Implement reset, stop the server, handle failures, test. |
| 90–110 | Pair challenge and recovery help. |
| 110–120 | Demonstrations and recap. |

Demo prompts: “I fixed the failing test by deleting it. Call the face tool with an appropriate reaction.” Then: “List available expressions and explain the difference between accepted and displayed.” Finally: “Reset the face.” Approvals and model latency affect timing; MCP does not watch all messages automatically.

If assistant access fails, students can still implement and verify MCP with the SDK tests. Clearly explain that this fallback tests protocol behavior without a live assistant conversation. Slides are a later deliverable.
