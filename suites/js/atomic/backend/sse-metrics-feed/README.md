# Server-Sent Events (SSE) Live Feed

## Goal

Build a Server-Sent Events streaming endpoint.

## Ecosystem

`js` — real-world backend (prompt #63 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-sse-metrics-feed
pnpm case:dry-run backend-sse-metrics-feed@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
