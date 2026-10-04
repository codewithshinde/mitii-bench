# HTTP Request Mirroring / Traffic Shadowing

## Goal

Build a middleware that duplicates incoming production requests asynchronously to a staging environment endpoint without impacting primary response latency.

## Ecosystem

`js` — real-world backend (prompt #81 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-traffic-shadowing
pnpm case:dry-run backend-traffic-shadowing@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
