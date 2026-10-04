# Dynamic Proxy / API Gateway Route

## Goal

Build an API Gateway reverse proxy endpoint using `http-proxy-middleware`.

## Ecosystem

`js` — real-world backend (prompt #93 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `http-proxy-middleware`

```bash
pnpm case:dry-run backend-api-gateway-proxy
pnpm case:dry-run backend-api-gateway-proxy@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
