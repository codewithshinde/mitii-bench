# In-Memory Search Engine with Inverted Index

## Goal

Build a lightweight full-text search indexer in pure JavaScript for a list of document objects supporting term frequency-inverse document frequency (TF-IDF) scoring.

## Ecosystem

`js` — real-world backend (prompt #90 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-inverted-index-search
pnpm case:dry-run backend-inverted-index-search@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
