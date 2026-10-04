# Request Payload Size Guard

## Goal

Build a streaming payload size validator middleware that aborts request connection immediately if streamed payload exceeds maximum byte threshold prior to loading full body.

## Ecosystem

`js` — real-world backend (prompt #94 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-payload-size-guard
pnpm case:dry-run backend-payload-size-guard@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
