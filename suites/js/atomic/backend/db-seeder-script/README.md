# DB Schema Seeder Script

## Goal

Build a robust database seeding CLI script supporting deterministic random generation (e.g., using `@faker-js/faker`) with configurable item counts and foreign key wiring.

## Ecosystem

`js` — real-world backend (prompt #80 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `@faker-js/faker`

```bash
pnpm case:dry-run backend-db-seeder-script
pnpm case:dry-run backend-db-seeder-script@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
