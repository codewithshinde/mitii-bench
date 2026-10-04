# Express Request Validation with Joi/Zod

## Goal

Build an Express POST route validating payload with Zod.

## Ecosystem

`js` — frameworks & ecosystem (prompt #28 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `zod`

```bash
pnpm case:dry-run backend-express-zod-validation
pnpm case:dry-run backend-express-zod-validation@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
