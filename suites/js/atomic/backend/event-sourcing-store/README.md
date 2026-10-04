# Microservice Event Sourcing Store

## Goal

Build an append-only event store module.

## Ecosystem

`js` — real-world backend (prompt #91 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-event-sourcing-store
pnpm case:dry-run backend-event-sourcing-store@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
