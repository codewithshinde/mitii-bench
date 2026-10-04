# Complete Microservice Architecture Shell

## Goal

Build a complete Node microservice core shell featuring:

## Ecosystem

`js` — real-world backend (prompt #100 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `pino`
- `zod`

```bash
pnpm case:dry-run backend-microservice-shell
pnpm case:dry-run backend-microservice-shell@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
