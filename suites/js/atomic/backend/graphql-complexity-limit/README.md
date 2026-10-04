# GraphQL Query Depth & Complexity Limiter

## Goal

Build a security middleware for a GraphQL endpoint that analyzes query AST depth and rejects queries exceeding depth/complexity limits to prevent DoS attacks.

## Ecosystem

`js` — real-world backend (prompt #88 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-graphql-complexity-limit
pnpm case:dry-run backend-graphql-complexity-limit@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
