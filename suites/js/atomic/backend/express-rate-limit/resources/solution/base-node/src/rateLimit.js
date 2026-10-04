/** Sliding-window rate limiter (in-memory store). */
const buckets = new Map();
const WINDOW_MS = 60_000;
const MAX = 5;

function clientKey(req) {
  return req.ip || req.headers["x-forwarded-for"] || "unknown";
}

export function rateLimitMiddleware(req, res, next) {
  const key = clientKey(req);
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket) bucket = { hits: [], windowStart: now };
  bucket.hits = bucket.hits.filter((t) => now - t < WINDOW_MS);
  if (bucket.hits.length >= MAX) {
    const oldest = bucket.hits[0];
    const retryAfter = Math.ceil((WINDOW_MS - (now - oldest)) / 1000);
    res.setHeader("X-RateLimit-Limit", String(MAX));
    res.setHeader("X-RateLimit-Remaining", "0");
    res.setHeader("Retry-After", String(Math.max(retryAfter, 1)));
    return res.status(429).json({ error: "Too many requests" });
  }
  bucket.hits.push(now);
  buckets.set(key, bucket);
  res.setHeader("X-RateLimit-Limit", String(MAX));
  res.setHeader("X-RateLimit-Remaining", String(MAX - bucket.hits.length));
  next();
}

export function _resetRateLimitStore() {
  buckets.clear();
}
