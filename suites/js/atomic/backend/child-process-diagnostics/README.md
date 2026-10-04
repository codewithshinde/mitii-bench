# Event Loop & Process Execution (Child Process)

## Goal

Build a module that runs shell tasks asynchronously using `child_process.exec`.

## Ecosystem

`js` — Node.js core / async (prompt #2 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-child-process-diagnostics
pnpm case:dry-run backend-child-process-diagnostics@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
