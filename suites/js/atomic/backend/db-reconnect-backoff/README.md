# Automatic Database Reconnection Strategy

## Goal

Build a resilient database connection manager wrapper handling connection drops with exponential backoff and retry limits.

## Ecosystem

`js` — real-world backend (prompt #82 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-db-reconnect-backoff
pnpm case:dry-run backend-db-reconnect-backoff@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
