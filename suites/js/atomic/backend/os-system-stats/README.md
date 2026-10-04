# OS Metrics Monitor

## Goal

Build a system resource metrics collector using `node:os`.

## Ecosystem

`js` — Node.js core / async (prompt #20 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-os-system-stats
pnpm case:dry-run backend-os-system-stats@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `npm test` (agent-hidden oracle and/or case tests)
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Source: `references/node-tasks.md`.
