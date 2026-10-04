# Data Masking & Anonymization Engine

## Goal

Build a log/export sanitizer module that recurses through objects and masks sensitive keys (`ssn`, `creditCard`, `password`) with `***REDACTED***`.

## Ecosystem

`js` — real-world backend (prompt #86 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-data-masking
pnpm case:dry-run backend-data-masking@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
