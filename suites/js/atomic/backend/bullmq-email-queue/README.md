# BullMQ Background Worker Queue

## Goal

Build a background email processing job queue using `bullmq` and Redis.

## Ecosystem

`js` — frameworks & ecosystem packages (prompt #40 from `references/node-tasks.md`).

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
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
