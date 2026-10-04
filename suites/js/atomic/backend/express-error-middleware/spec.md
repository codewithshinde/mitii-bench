Build a centralized Express error middleware.

* **Signature**: `app.use((err, req, res, next) => {})`
* **Output**: Returns JSON `{ "error": err.message, "status": err.statusCode || 500 }` with masked stack traces in production environment.

Implement primarily in `src/errorMiddleware.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
