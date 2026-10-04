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
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
