# Environment Config with Envalid / Zod

## Goal

Build a startup configuration validator parsing `process.env`.

## Ecosystem

`js` — frameworks & ecosystem (prompt #54 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `zod`

```bash
pnpm case:dry-run backend-env-config-validator
pnpm case:dry-run backend-env-config-validator@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
