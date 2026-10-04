# Health Check & Liveness/Readiness Probes

## Goal

Build Kubernetes-friendly health check routes.

## Ecosystem

`js` — real-world backend (prompt #59 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-health-liveness-readiness
pnpm case:dry-run backend-health-liveness-readiness@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
