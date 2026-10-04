# Module System Interop (CJS & ESM)

## Goal

Build a dual-package entry point utility library supporting both CommonJS (`require`) and ES Modules (`import`).

## Ecosystem

`js` — Node.js core / async (prompt #11 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-dual-package-exports
pnpm case:dry-run backend-dual-package-exports@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
