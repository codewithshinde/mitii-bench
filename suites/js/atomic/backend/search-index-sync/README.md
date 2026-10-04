# ElasticSearch / Meilisearch Sync Pipeline

## Goal

Build a database hook or change-stream listener utility that synchronizes inserts/updates/deletes instantly to a search index engine.

## Ecosystem

`js` — real-world backend (prompt #97 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-search-index-sync
pnpm case:dry-run backend-search-index-sync@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
