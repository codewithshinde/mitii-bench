# Crypto Module (Password Hashing)

## Goal

Build a secure password hashing helper using `crypto.scrypt` (native).

## Ecosystem

`js` — Node.js core / async (prompt #7 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-crypto-scrypt-password
pnpm case:dry-run backend-crypto-scrypt-password@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
