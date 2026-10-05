Add API key auth in `src/index.js` (helpers under `src/` ok). Keep `npm run build` green.

- Export `createApiKey(name)` and `apiKeyMiddleware` from `src/index.js`
- `createApiKey(name)` stores a hash in the DB and returns the plaintext key as a **string** (not an object)
- Middleware reads `X-API-Key` (via `req.header(...)` or `req.headers["x-api-key"]`), checks it against hashed keys in the DB, bumps usage, sets `req.apiKey` with a numeric `usage` field
- `POST /admin/keys` returns `201` with `{ key: "..." }` (plaintext once)
