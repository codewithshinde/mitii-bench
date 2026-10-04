# Automatic Database Reconnection Strategy

## Goal

Build a resilient database connection manager wrapper handling connection drops with exponential backoff and retry limits.

## Ecosystem

`js` — real-world backend (prompt #82 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-db-reconnect-backoff
pnpm case:dry-run backend-db-reconnect-backoff@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
