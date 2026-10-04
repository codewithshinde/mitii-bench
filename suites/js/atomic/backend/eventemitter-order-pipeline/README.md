# Custom EventEmitter Pipeline

## Goal

Build a order processing pipeline using `events.EventEmitter`.

## Ecosystem

`js` — Node.js core / async (prompt #4 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-eventemitter-order-pipeline
pnpm case:dry-run backend-eventemitter-order-pipeline@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
