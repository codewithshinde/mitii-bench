Build a crash protection handler setup.

* **Listeners**: Capture `process.on('uncaughtException')` and `process.on('unhandledRejection')`.
* **Behavior**: Write structured error JSON to log file and trigger graceful process teardown with exit code `1`.

Implement primarily in `src/crashGuard.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
