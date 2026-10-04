# Database Connection Pool Health Monitor

## Goal

Build a database monitoring loop that queries connection pool state (`activeConnections`, `idleConnections`, `queuedRequests`) and emits alerts if connection pool starvation occurs.

## Ecosystem

`js` — real-world backend (prompt #75 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-db-pool-monitor
pnpm case:dry-run backend-db-pool-monitor@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
