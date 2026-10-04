Build an automated mutation logger middleware.

* **Behavior**: Intercepts `POST`, `PUT`, `DELETE` operations and records user ID, target endpoint, changed fields, timestamp, and IP to an audit table.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
