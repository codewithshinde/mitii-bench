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
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
