Build an authentication guard for incoming Socket.io connections.

* **Middleware**: `io.use()` validates JWT passed in `socket.handshake.auth.token`. Reject connection if invalid.

### Task Queues & Caching (BullMQ, Redis)

Implement primarily in `src/socketAuth.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding. Install required packages: `socket.io`, `jsonwebtoken`.
