Build an API idempotency engine using Redis.

* **Header**: `Idempotency-Key`
* **Behavior**: Caches API response by key. Submitting same payload returns cached response instantly without re-executing handler.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
