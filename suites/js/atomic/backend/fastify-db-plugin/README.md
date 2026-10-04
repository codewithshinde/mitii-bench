# Fastify Plugin Architecture

## Goal

Build a Fastify custom plugin using `fastify-plugin`.

## Ecosystem

`js` — frameworks & ecosystem (prompt #43 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `fastify`
- `fastify-plugin`

```bash
pnpm case:dry-run backend-fastify-db-plugin
pnpm case:dry-run backend-fastify-db-plugin@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
