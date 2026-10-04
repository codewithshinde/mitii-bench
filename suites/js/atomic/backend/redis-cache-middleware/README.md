# Redis Caching Middleware for Express

## Goal

Build a cache lookup middleware using `ioredis`.

## Ecosystem

`js` — frameworks & ecosystem packages (prompt #41 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `ioredis`

```bash
pnpm case:dry-run backend-redis-cache-middleware
pnpm case:dry-run backend-redis-cache-middleware@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
