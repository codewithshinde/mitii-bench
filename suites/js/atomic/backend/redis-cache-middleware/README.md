# Redis Caching Middleware for Express

## Goal

Build a cache lookup middleware using `ioredis`.

## Ecosystem

`js` — frameworks & ecosystem (prompt #41 from `references/node-tasks.md`).

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
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
