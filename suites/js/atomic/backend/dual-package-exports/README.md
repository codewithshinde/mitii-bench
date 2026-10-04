# Module System Interop (CJS & ESM)

## Goal

Build a dual-package entry point utility library supporting both CommonJS (`require`) and ES Modules (`import`).

## Ecosystem

`js` — Node.js core / async (prompt #11 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-dual-package-exports
pnpm case:dry-run backend-dual-package-exports@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
