Build an Express POST route validating payload with Zod.

* **Route**: `POST /api/users`
* **Schema**: Email string, age >= 18, password min 8 chars. Return HTTP `400 Bad Request` with structured error array on validation failure.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding. Install required packages: `zod`.
