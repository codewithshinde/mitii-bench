import express from "express";

class InMemoryRedis {
  constructor() { this.kv = new Map(); }
  set(key, value) { this.kv.set(key, value); return "OK"; }
  get(key) { return this.kv.get(key) ?? null; }
}

export const redis = new InMemoryRedis();

export function idempotencyMiddleware(req, res, next) {
  const key = req.header("Idempotency-Key");
  if (!key || req.method === "GET") return next();
  const cacheKey = `idem:${key}`;
  const cached = redis.get(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached);
    return res.status(parsed.status).json(parsed.body);
  }
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    redis.set(cacheKey, JSON.stringify({ status: res.statusCode || 200, body }));
    return originalJson(body);
  };
  next();
}

const app = express();
app.use(express.json());
app.use(idempotencyMiddleware);
app.post("/pay", (req, res) => res.status(201).json({ paid: true, amount: req.body?.amount ?? 0 }));

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server };
