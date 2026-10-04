# NestJS Custom Guard (RBAC)

## Goal

Build a NestJS Role-Based Access Control guard using `CanActivate`.

## Ecosystem

`js` — frameworks & ecosystem (prompt #45 from `references/node-tasks.md`).

## Bases

- `base-nest-js`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-nest-roles-guard
pnpm case:dry-run backend-nest-roles-guard@base-nest-js
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
