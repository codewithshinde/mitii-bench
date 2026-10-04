# Knex.js Query Builder Migrations

## Goal

Build a Knex.js database migration file.

## Ecosystem

`js` — frameworks & ecosystem packages (prompt #37 from `references/node-tasks.md`).

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
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
