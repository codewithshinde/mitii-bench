# Worker Threads for Heavy Computation

## Goal

Build an API endpoint offloading CPU-bound tasks to worker threads (`worker_threads`).

## Ecosystem

`js` — Node.js core / async (prompt #8 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-worker-fibonacci
pnpm case:dry-run backend-worker-fibonacci@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
