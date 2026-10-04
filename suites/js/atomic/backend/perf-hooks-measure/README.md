# Performance Hooks Benchmarking

## Goal

Build an execution performance logger using `perf_hooks`.

## Ecosystem

`js` — Node.js core / async (prompt #21 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-perf-hooks-measure
pnpm case:dry-run backend-perf-hooks-measure@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `npm test` (agent-hidden oracle and/or case tests)
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Source: `references/node-tasks.md`.
