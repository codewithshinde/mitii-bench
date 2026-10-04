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
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
