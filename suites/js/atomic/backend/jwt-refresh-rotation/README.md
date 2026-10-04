# JWT Access & Refresh Token Rotation

## Goal

Build a token pair issuer and refresher utility using `jose` or `jsonwebtoken`.

## Ecosystem

`js` — frameworks & ecosystem (prompt #49 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `jose`

```bash
pnpm case:dry-run backend-jwt-refresh-rotation
pnpm case:dry-run backend-jwt-refresh-rotation@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
