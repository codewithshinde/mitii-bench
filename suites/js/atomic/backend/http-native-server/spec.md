Build a native HTTP server using Node's `http` module.

* **Route**: `GET /health`
* **Response**: Status `200 OK` with JSON `{"status": "ok", "uptime": process.uptime()}`.
* **Route**: `POST /echo`
* **Behavior**: Parse raw incoming stream data chunks and return the identical body back as JSON.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
