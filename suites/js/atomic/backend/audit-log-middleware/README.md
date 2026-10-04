# Audit Logging System

## Goal

Build an automated mutation logger middleware.

## Ecosystem

`js` — real-world backend (prompt #66 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-audit-log-middleware
pnpm case:dry-run backend-audit-log-middleware@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
