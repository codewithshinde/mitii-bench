# Socket.io JWT Authentication Handshake

## Goal

Build an authentication guard for incoming Socket.io connections.

## Ecosystem

`js` — frameworks & ecosystem packages (prompt #39 from `references/node-tasks.md`).

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
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
