# Request Payload Size Guard

## Goal

Build a streaming payload size validator middleware that aborts request connection immediately if streamed payload exceeds maximum byte threshold prior to loading full body.

## Ecosystem

`js` — real-world backend (prompt #94 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-payload-size-guard
pnpm case:dry-run backend-payload-size-guard@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
