# AbortController for Async Operations

## Goal

Build a fetch wrapper accepting an `AbortSignal`.

## Ecosystem

`js` — Node.js core / async (prompt #14 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-fetch-with-timeout
pnpm case:dry-run backend-fetch-with-timeout@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
