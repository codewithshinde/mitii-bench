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
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
