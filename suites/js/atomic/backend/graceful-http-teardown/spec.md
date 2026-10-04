Build a server connection tracking teardown handler.

* **Behavior**: Keep track of open HTTP connections; when shutting down, wait up to 10 seconds for active requests to finish before forcefully destroying remaining sockets.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
