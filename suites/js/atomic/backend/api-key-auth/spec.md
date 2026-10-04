Build an API Key authorization system.

* **Middleware**: Validates `X-API-Key` header against hashed keys in database. Tracks usage count per key.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
