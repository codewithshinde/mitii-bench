# Socket.io JWT Authentication Handshake

## Goal

Build an authentication guard for incoming Socket.io connections.

## Ecosystem

`js` — frameworks & ecosystem (prompt #39 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `socket.io`
- `jsonwebtoken`

```bash
pnpm case:dry-run backend-socketio-jwt-handshake
pnpm case:dry-run backend-socketio-jwt-handshake@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
