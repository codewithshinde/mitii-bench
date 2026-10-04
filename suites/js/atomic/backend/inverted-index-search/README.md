# In-Memory Search Engine with Inverted Index

## Goal

Build a lightweight full-text search indexer in pure JavaScript for a list of document objects supporting term frequency-inverse document frequency (TF-IDF) scoring.

## Ecosystem

`js` — real-world backend (prompt #90 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-inverted-index-search
pnpm case:dry-run backend-inverted-index-search@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
