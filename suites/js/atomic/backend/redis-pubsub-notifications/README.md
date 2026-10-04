# Real-Time Distributed Notification System

## Goal

Build a multi-server event dispatcher using Redis Pub/Sub to sync notification alerts across connected client WebSockets across different Node server nodes.

## Ecosystem

`js` — real-world backend (prompt #87 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `ioredis`
- `socket.io`

```bash
pnpm case:dry-run backend-redis-pubsub-notifications
pnpm case:dry-run backend-redis-pubsub-notifications@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
