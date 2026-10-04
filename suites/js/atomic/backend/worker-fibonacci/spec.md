Build an API endpoint offloading CPU-bound tasks to worker threads (`worker_threads`).

* **Endpoint**: `GET /calculate-fibonacci?n=45`
* **Requirement**: Main Event Loop must remain responsive to incoming health check queries while calculation runs.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
