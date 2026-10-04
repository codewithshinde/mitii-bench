# Prisma Pagination & Filtering

## Goal

Build a product search service with Prisma.

## Ecosystem

`js` — frameworks & ecosystem (prompt #34 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `prisma`
- `@prisma/client`

```bash
pnpm case:dry-run backend-prisma-product-search
pnpm case:dry-run backend-prisma-product-search@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
