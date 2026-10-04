# Prisma ORM Transaction Handling

## Goal

Build an e-commerce balance transfer using Prisma interactive transactions.

## Ecosystem

`js` — frameworks & ecosystem (prompt #33 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `prisma`
- `@prisma/client`

```bash
pnpm case:dry-run backend-prisma-balance-transfer
pnpm case:dry-run backend-prisma-balance-transfer@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
