# Rest API CRUD with File Storage Backup

## Goal

Build a complete RESTful API for managing articles with CRUD operations, saving data to local JSON file persistence safely using temporary atomic write patterns.

## Ecosystem

`js` — real-world backend (prompt #56 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-articles-json-crud
pnpm case:dry-run backend-articles-json-crud@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
