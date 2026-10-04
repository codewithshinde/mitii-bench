# V8 Memory Heap Profiler

## Goal

Build a memory leak detection utility using `v8` module.

## Ecosystem

`js` — Node.js core / async (prompt #22 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-v8-heap-limits
pnpm case:dry-run backend-v8-heap-limits@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
