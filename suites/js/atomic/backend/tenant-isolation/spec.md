Build a multi-tenant middleware system.

* **Behavior**: Extracts tenant identifier from subdomain (`tenant1.app.com`) or header `x-tenant-id`. Sets database connection schema dynamically based on tenant context.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
