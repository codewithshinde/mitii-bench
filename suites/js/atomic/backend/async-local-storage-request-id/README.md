# Asynchronous Context Tracking (`AsyncLocalStorage`)

## Goal

Build a request correlation ID tracking context module.

## Ecosystem

`js` — Node.js core / async (prompt #9 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-async-local-storage-request-id
pnpm case:dry-run backend-async-local-storage-request-id@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
