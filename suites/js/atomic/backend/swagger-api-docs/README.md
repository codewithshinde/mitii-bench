# OpenAPI / Swagger Documentation Generator

## Goal

Build an OpenAPI route documentation wrapper using `swagger-ui-express`.

## Ecosystem

`js` — frameworks & ecosystem (prompt #55 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `swagger-ui-express`

```bash
pnpm case:dry-run backend-swagger-api-docs
pnpm case:dry-run backend-swagger-api-docs@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
