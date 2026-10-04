Build a task scheduler using `node-cron`.

* **Requirement**: Use Redis lock (`redlock`) so that only one Node instance executes the cron task when running multiple instances.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding. Install required packages: `node-cron`, `redlock`, `ioredis`.
