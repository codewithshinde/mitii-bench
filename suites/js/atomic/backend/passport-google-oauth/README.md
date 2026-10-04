# Passport.js OAuth2 Strategy Integration

## Goal

Configure a Passport.js Google OAuth2 strategy.

## Ecosystem

`js` — frameworks & ecosystem (prompt #48 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `passport`
- `passport-google-oauth20`

```bash
pnpm case:dry-run backend-passport-google-oauth
pnpm case:dry-run backend-passport-google-oauth@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
