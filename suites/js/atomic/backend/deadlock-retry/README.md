# Database Deadlock Retry Handler

## Goal

Build a database execution wrapper that detects SQL deadlock/serialization failure error codes (e.g., Postgres code `40001` or `40P01`) and retries query execution up to 3 times with jittered delays.

## Ecosystem

`js` — real-world backend (prompt #96 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-deadlock-retry
pnpm case:dry-run backend-deadlock-retry@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
