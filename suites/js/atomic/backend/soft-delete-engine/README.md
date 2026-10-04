# Soft Delete Engine

## Goal

Build an abstraction layer or ORM plugin automatically transforming `delete` commands into soft updates (`deleted_at = NOW()`) and filtering them out of standard `find` queries.

## Ecosystem

`js` — real-world backend (prompt #73 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-soft-delete-engine
pnpm case:dry-run backend-soft-delete-engine@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
