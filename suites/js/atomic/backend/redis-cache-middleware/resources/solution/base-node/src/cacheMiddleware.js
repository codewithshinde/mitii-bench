/** Express cache middleware (ioredis-compatible via in-memory client). */
import MemoryRedis from "./memoryRedis.js";

const redis = new MemoryRedis();
const TTL = 60;

function cacheKey(req) {
  return `cache:${req.originalUrl}`;
}

export function cacheMiddleware(req, res, next) {
  redis.get(cacheKey(req)).then((cached) => {
    if (cached) {
      res.setHeader("X-Cache", "HIT");
      res.setHeader("Content-Type", "application/json");
      return res.end(cached);
    }
    res.setHeader("X-Cache", "MISS");
    const originalSend = res.send.bind(res);
    res.send = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        redis.setex(cacheKey(req), TTL, typeof body === "string" ? body : JSON.stringify(body));
      }
      return originalSend(body);
    };
    next();
  });
}

export function _cacheRedis() {
  return redis;
}
