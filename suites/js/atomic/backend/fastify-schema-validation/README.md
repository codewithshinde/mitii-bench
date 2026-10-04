# Fastify Schema Validation & Hooks

## Goal

Build a Fastify route using built-in JSON schema validation.

## Ecosystem

`js` — frameworks & ecosystem (prompt #42 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `fastify`

```bash
pnpm case:dry-run backend-fastify-schema-validation
pnpm case:dry-run backend-fastify-schema-validation@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
