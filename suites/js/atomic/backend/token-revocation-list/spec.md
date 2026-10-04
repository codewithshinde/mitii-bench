Build a token blacklist mechanism backed by Redis.

* **Endpoint**: `POST /logout` adds token ID to Redis with TTL equal to remaining token lifespan.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding. Install required packages: `ioredis`.
