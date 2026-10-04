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
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
