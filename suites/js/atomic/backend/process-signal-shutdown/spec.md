Build a process signal listener for graceful shutdown.

* **Listeners**: Intercept `SIGINT` (Ctrl+C) and `SIGTERM`.
* **Action**: Stop accepting new TCP connections, clear active timers, and shut down process cleanly.

Implement primarily in `src/gracefulShutdown.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
