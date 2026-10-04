# Scheduled Cron Jobs with Locks

## Goal

Build a task scheduler using `node-cron`.

## Ecosystem

`js` — real-world backend (prompt #69 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `node-cron`
- `redlock`
- `ioredis`

```bash
pnpm case:dry-run backend-cron-redis-lock
pnpm case:dry-run backend-cron-redis-lock@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
