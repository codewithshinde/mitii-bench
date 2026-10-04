# Readline CLI Tool

## Goal

Build an interactive CLI wizard using Node `readline` module.

## Ecosystem

`js` — Node.js core / async (prompt #12 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-readline-env-wizard
pnpm case:dry-run backend-readline-env-wizard@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
