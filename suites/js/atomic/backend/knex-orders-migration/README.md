# Knex.js Query Builder Migrations

## Goal

Build a Knex.js database migration file.

## Ecosystem

`js` — frameworks & ecosystem (prompt #37 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `knex`

```bash
pnpm case:dry-run backend-knex-orders-migration
pnpm case:dry-run backend-knex-orders-migration@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
