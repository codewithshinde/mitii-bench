# Cluster Module Load Balancing

## Goal

Build a basic multi-process web server using Node `cluster` module.

## Ecosystem

`js` — Node.js core / async (prompt #16 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-cluster-load-balance
pnpm case:dry-run backend-cluster-load-balance@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
