# Feature Flag Manager

## Goal

Build a dynamic feature toggle service with user targeting.

## Ecosystem

`js` — real-world backend (prompt #77 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-feature-flag-manager
pnpm case:dry-run backend-feature-flag-manager@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
