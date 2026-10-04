Build a memory-efficient data export endpoint.

* **Behavior**: Streams SQL database rows directly into CSV formatter and pipes to HTTP response stream without creating in-memory array.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
