# GraphQL Dataloader for N+1 Queries

## Goal

Build a batching loader using `dataloader`.

## Ecosystem

`js` — frameworks & ecosystem (prompt #51 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `dataloader`

```bash
pnpm case:dry-run backend-graphql-dataloader
pnpm case:dry-run backend-graphql-dataloader@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
