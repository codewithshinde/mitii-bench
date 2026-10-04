# Fastify Plugin Architecture

## Goal

Build a Fastify custom plugin using `fastify-plugin`.

## Ecosystem

`js` — frameworks & ecosystem packages (prompt #43 from `references/node-tasks.md`).

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
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
