Build a sliding window rate limiter middleware from scratch using Redis/In-memory store.

* **Rule**: Max 5 requests per minute per IP address.
* **Headers**: Expose `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `Retry-After`.

Implement primarily in `src/rateLimit.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
