Build a cache lookup middleware using `ioredis`.

* **Key Strategy**: Hash of `req.originalUrl`.
* **Behavior**: Return cached JSON on hit; on miss, intercept `res.send`, save to Redis with 60-second TTL, and send response.

### Fastify Framework

Implement primarily in `src/cacheMiddleware.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
