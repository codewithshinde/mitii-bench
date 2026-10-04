# Environment Config with Envalid / Zod

## Goal

Build a startup configuration validator parsing `process.env`.

## Ecosystem

`js` — frameworks & ecosystem packages (prompt #54 from `references/node-tasks.md`).

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
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
