# Socket.io Room Broadcasting

## Goal

Build a real-time chat room backend using `socket.io`.

## Ecosystem

`js` — frameworks & ecosystem (prompt #38 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `socket.io`

```bash
pnpm case:dry-run backend-socketio-chat-rooms
pnpm case:dry-run backend-socketio-chat-rooms@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
