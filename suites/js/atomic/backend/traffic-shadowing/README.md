# HTTP Request Mirroring / Traffic Shadowing

## Goal

Build a middleware that duplicates incoming production requests asynchronously to a staging environment endpoint without impacting primary response latency.

## Ecosystem

`js` — real-world backend (prompt #81 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-traffic-shadowing
pnpm case:dry-run backend-traffic-shadowing@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
