Build a bulk data processing system.

* **Endpoint**: `POST /api/jobs` accepting an array of 1,000 items.
* **Tracking**: Returns `jobId`. Client can query `GET /api/jobs/:id` to inspect completion percentage.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
