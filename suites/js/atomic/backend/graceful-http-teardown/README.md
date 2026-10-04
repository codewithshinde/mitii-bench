# Graceful HTTP Server Teardown

## Goal

Build a server connection tracking teardown handler.

## Ecosystem

`js` — real-world backend (prompt #62 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-graceful-http-teardown
pnpm case:dry-run backend-graceful-http-teardown@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
