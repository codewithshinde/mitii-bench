# Apollo Server Schema & Resolvers

## Goal

Build a GraphQL API using `@apollo/server`.

## Ecosystem

`js` — frameworks & ecosystem (prompt #50 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `@apollo/server`
- `graphql`

```bash
pnpm case:dry-run backend-apollo-user-query
pnpm case:dry-run backend-apollo-user-query@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
