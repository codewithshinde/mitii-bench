# TypeORM Entity Relationships

## Goal

Build a One-to-Many entity relationship in TypeORM (`Author` and `Post`).

## Ecosystem

`js` — frameworks & ecosystem (prompt #36 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `typeorm`

```bash
pnpm case:dry-run backend-typeorm-author-posts
pnpm case:dry-run backend-typeorm-author-posts@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
