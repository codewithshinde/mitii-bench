# Event Loop & Process Execution (Child Process)

## Goal

Build a module that runs shell tasks asynchronously using `child_process.exec`.

## Ecosystem

`js` — Node.js core / async (prompt #2 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-child-process-diagnostics
pnpm case:dry-run backend-child-process-diagnostics@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
