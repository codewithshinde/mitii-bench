Build an Express metrics collection middleware using `prom-client`.

* **Route**: `GET /metrics` exposing HTTP request durations histogram, system memory usage, and error counters in Prometheus format.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding. Install required packages: `prom-client`.
