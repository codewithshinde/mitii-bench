Build a complete Node microservice core shell featuring:

* Express HTTP server with structured JSON logging (`pino`)
* Graceful shutdown handlers (`SIGTERM`)
* Health check endpoints (`/health/liveness`, `/health/readiness`)
* DB connection abstraction with auto-reconnect
* Centralized error handler and environment variable validator (`zod`).

---

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding. Install required packages: `pino`, `zod`.
