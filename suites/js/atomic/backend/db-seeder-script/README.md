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
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
