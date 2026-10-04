# Express Rate Limiting Middleware

## Goal

Build a sliding window rate limiter middleware from scratch using Redis/In-memory store.

## Ecosystem

`js` — frameworks & ecosystem packages (prompt #27 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-express-rate-limit
pnpm case:dry-run backend-express-rate-limit@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
