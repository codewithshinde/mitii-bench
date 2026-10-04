import express from "express";

class InMemoryRedis {
  constructor() { this.kv = new Map(); }
  setex(key, ttlSec, value) {
    this.kv.set(key, { value, expires: Date.now() + ttlSec * 1000 });
    return "OK";
  }
  get(key) {
    const row = this.kv.get(key);
    if (!row || row.expires < Date.now()) { this.kv.delete(key); return null; }
    return row.value;
  }
}

export const redis = new InMemoryRedis();
export const blacklist = {
  /** Store revoked JTI with TTL seconds. */
  add(jti, ttlSec) { redis.setex(`blacklist:${jti}`, ttlSec, "1"); }, // TTL seconds
  has(jti) { return redis.get(`blacklist:${jti}`) != null; },
};

const app = express();
app.use(express.json());
app.post("/logout", (req, res) => {
  const { jti, ttlSec = 3600 } = req.body ?? {};
  if (!jti) return res.status(400).json({ error: "jti required" });
  blacklist.add(jti, ttlSec);
  res.json({ revoked: true });
});
app.get("/check/:jti", (req, res) => res.json({ revoked: blacklist.has(req.params.jti) }));

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server };
