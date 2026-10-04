# JWT Access & Refresh Token Rotation

## Goal

Build a token pair issuer and refresher utility using `jose` or `jsonwebtoken`.

## Ecosystem

`js` — frameworks & ecosystem packages (prompt #49 from `references/node-tasks.md`).

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
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
