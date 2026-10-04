# Complete Microservice Architecture Shell

## Goal

Build a complete Node microservice core shell featuring:

## Ecosystem

`js` — real-world backend (prompt #100 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `pino`
- `zod`

```bash
pnpm case:dry-run backend-microservice-shell
pnpm case:dry-run backend-microservice-shell@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
