# Data Masking & Anonymization Engine

## Goal

Build a log/export sanitizer module that recurses through objects and masks sensitive keys (`ssn`, `creditCard`, `password`) with `***REDACTED***`.

## Ecosystem

`js` — real-world backend (prompt #86 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-data-masking
pnpm case:dry-run backend-data-masking@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `npm test` (agent-hidden oracle and/or case tests)
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Source: `references/node-tasks.md`.
