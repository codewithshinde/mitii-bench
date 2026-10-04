# BullMQ Background Worker Queue

## Goal

Build a background email processing job queue using `bullmq` and Redis.

## Ecosystem

`js` — frameworks & ecosystem (prompt #40 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `bullmq`
- `ioredis`

```bash
pnpm case:dry-run backend-bullmq-email-queue
pnpm case:dry-run backend-bullmq-email-queue@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
