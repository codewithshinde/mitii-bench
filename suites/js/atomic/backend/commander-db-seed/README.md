# Commander.js CLI Application

## Goal

Build a Node CLI utility using `commander`.

## Ecosystem

`js` — frameworks & ecosystem (prompt #52 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `commander`

```bash
pnpm case:dry-run backend-commander-db-seed
pnpm case:dry-run backend-commander-db-seed@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
