# Passport.js OAuth2 Strategy Integration

## Goal

Configure a Passport.js Google OAuth2 strategy.

## Ecosystem

`js` — frameworks & ecosystem packages (prompt #48 from `references/node-tasks.md`).

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
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
