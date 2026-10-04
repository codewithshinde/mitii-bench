# Tenant Isolation Middleware (Multi-Tenant App)

## Goal

Build a multi-tenant middleware system.

## Ecosystem

`js` — real-world backend (prompt #65 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-tenant-isolation
pnpm case:dry-run backend-tenant-isolation@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
