Build a database monitoring loop that queries connection pool state (`activeConnections`, `idleConnections`, `queuedRequests`) and emits alerts if connection pool starvation occurs.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
