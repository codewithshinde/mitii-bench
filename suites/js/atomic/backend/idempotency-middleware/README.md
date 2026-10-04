# Distributed Idempotency Key Middleware

## Goal

Build an API idempotency engine using Redis.

## Ecosystem

`js` — real-world backend (prompt #79 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `ioredis`

```bash
pnpm case:dry-run backend-idempotency-middleware
pnpm case:dry-run backend-idempotency-middleware@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
