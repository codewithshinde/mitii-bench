# GraphQL Query Depth & Complexity Limiter

## Goal

Build a security middleware for a GraphQL endpoint that analyzes query AST depth and rejects queries exceeding depth/complexity limits to prevent DoS attacks.

## Ecosystem

`js` — real-world backend (prompt #88 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-graphql-complexity-limit
pnpm case:dry-run backend-graphql-complexity-limit@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
