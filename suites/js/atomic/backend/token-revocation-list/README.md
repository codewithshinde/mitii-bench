# OAuth2 Refresh Token Revocation List

## Goal

Build a token blacklist mechanism backed by Redis.

## Ecosystem

`js` — real-world backend (prompt #74 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `ioredis`

```bash
pnpm case:dry-run backend-token-revocation-list
pnpm case:dry-run backend-token-revocation-list@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
