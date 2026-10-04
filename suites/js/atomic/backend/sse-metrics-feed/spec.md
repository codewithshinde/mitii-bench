Build a Server-Sent Events streaming endpoint.

* **Endpoint**: `GET /api/events`
* **Headers**: `Content-Type: text/event-stream`. Pushes CPU metrics every second.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
