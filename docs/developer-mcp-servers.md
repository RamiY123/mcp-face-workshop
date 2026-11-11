# Useful MCP servers for developers

Start with GitHub for repository work, Context7 for library documentation, and Playwright for checking browser behavior. Add other servers when they match tools your team already uses.

| MCP server | What it gives a coding assistant | Example request |
| --- | --- | --- |
| [GitHub](https://github.com/github/github-mcp-server) | Repository, issue, pull request, and CI context | Summarize this PR and identify which checks failed. |
| [Context7](https://github.com/upstash/context7/blob/master/packages/mcp/README.md) | Library documentation and code examples for a specified version | Check the docs for the version in our lockfile before changing this API call. |
| [Playwright](https://github.com/microsoft/playwright-mcp) | Browser interaction for exercising user flows | Open the local app, submit the form, and verify that the confirmation appears. |
| [Chrome DevTools](https://github.com/ChromeDevTools/chrome-devtools-mcp) | Console messages, network requests, and performance traces | Reproduce the blank page and identify the first failing request. |
| [Sentry](https://mcp.sentry.dev/) | Error reports and performance data from a Sentry project | Summarize the latest checkout error and point me to the relevant stack frames. |
| [Linear](https://linear.app/docs/mcp) | Issues and project context from a Linear workspace | Find the ticket for this bug and pull out the acceptance criteria. |
| [Figma](https://developers.figma.com/docs/figma-mcp-server/) | Design context and assets for implementation | Inspect this frame and identify the components and spacing used. |
| [Supabase](https://supabase.com/docs/guides/ai-tools/mcp) | Database schema and project tooling | Inspect the development database and show how orders relate to customers. |

## Workshop examples

Use GitHub to find a requirement, Context7 to check the relevant API, and Playwright to verify the result in a browser. Playwright works well for a live demo because participants can watch the browser act and compare what they see with the tool result.
