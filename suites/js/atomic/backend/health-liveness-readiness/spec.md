Build Kubernetes-friendly health check routes.

* **Route**: `GET /health/liveness` (returns 200 if process alive).
* **Route**: `GET /health/readiness` (returns 200 if DB and Redis connections active, 503 if disconnected).

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
