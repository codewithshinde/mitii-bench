# Worker Threads for Heavy Computation

## Goal

Build an API endpoint offloading CPU-bound tasks to worker threads (`worker_threads`).

## Ecosystem

`js` — Node.js core / async (prompt #8 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-worker-fibonacci
pnpm case:dry-run backend-worker-fibonacci@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
