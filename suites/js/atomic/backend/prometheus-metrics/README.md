# Metrics Exporter for Prometheus

## Goal

Build an Express metrics collection middleware using `prom-client`.

## Ecosystem

`js` — real-world backend (prompt #98 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `prom-client`

```bash
pnpm case:dry-run backend-prometheus-metrics
pnpm case:dry-run backend-prometheus-metrics@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
