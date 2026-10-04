# Express Rate Limiting Middleware

## Goal

Build a sliding window rate limiter middleware from scratch using Redis/In-memory store.

## Ecosystem

`js` — frameworks & ecosystem (prompt #27 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-express-rate-limit
pnpm case:dry-run backend-express-rate-limit@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
