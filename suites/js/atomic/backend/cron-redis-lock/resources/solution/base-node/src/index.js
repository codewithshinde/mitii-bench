import cron from "node-cron";

/** In-memory redlock-style lock (no Redis server required for dry-run). */

class InMemoryRedis {
  constructor() { this.locks = new Map(); }
  async set(key, value, mode, ttlType, ttlMs) {
    if (mode === "PX" && this.locks.has(key)) return null;
    this.locks.set(key, { value, expires: Date.now() + Number(ttlMs) });
    return "OK";
  }
  async eval(_script, _n, key) {
    if (this.locks.has(key)) { this.locks.delete(key); return 1; }
    return 0;
  }
}

const redis = new InMemoryRedis();
let runs = 0;

export async function acquireLock(name, ttlMs = 5000) {
  const token = String(Date.now());
  const ok = await redis.set(`lock:${name}`, token, "PX", "PX", ttlMs);
  return ok ? token : null;
}

export function scheduleDailyJob(expression, taskName, fn) {
  return cron.schedule(expression, async () => {
    const token = await acquireLock(taskName);
    if (!token) return;
    try { await fn(); runs += 1; } finally { await redis.eval("", 1, `lock:${taskName}`); }
  });
}

export { redis, runs };
