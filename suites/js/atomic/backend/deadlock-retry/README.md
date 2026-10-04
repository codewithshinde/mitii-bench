# Database Deadlock Retry Handler

## Goal

Build a database execution wrapper that detects SQL deadlock/serialization failure error codes (e.g., Postgres code `40001` or `40P01`) and retries query execution up to 3 times with jittered delays.

## Ecosystem

`js` — real-world backend (prompt #96 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-deadlock-retry
pnpm case:dry-run backend-deadlock-retry@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
