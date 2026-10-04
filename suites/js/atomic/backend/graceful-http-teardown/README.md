# Graceful HTTP Server Teardown

## Goal

Build a server connection tracking teardown handler.

## Ecosystem

`js` — real-world backend (prompt #62 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-graceful-http-teardown
pnpm case:dry-run backend-graceful-http-teardown@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
