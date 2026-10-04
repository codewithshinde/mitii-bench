# V8 Memory Heap Profiler

## Goal

Build a memory leak detection utility using `v8` module.

## Ecosystem

`js` — Node.js core / async (prompt #22 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-v8-heap-limits
pnpm case:dry-run backend-v8-heap-limits@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
