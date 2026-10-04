# Express JWT Authentication Middleware

## Goal

Build a route protection middleware validating Bearer JWTs.

## Ecosystem

`js` — frameworks & ecosystem (prompt #30 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `jsonwebtoken`

```bash
pnpm case:dry-run backend-express-jwt-auth
pnpm case:dry-run backend-express-jwt-auth@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
