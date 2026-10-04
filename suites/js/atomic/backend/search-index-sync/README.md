# ElasticSearch / Meilisearch Sync Pipeline

## Goal

Build a database hook or change-stream listener utility that synchronizes inserts/updates/deletes instantly to a search index engine.

## Ecosystem

`js` — real-world backend (prompt #97 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-search-index-sync
pnpm case:dry-run backend-search-index-sync@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
