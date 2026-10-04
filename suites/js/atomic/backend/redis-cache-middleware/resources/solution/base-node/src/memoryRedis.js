/** In-memory Redis-compatible store for dry-run (no server required). */
const store = new Map();
const expiry = new Map();

function purge(key) {
  const exp = expiry.get(key);
  if (exp != null && Date.now() >= exp) {
    store.delete(key);
    expiry.delete(key);
    return true;
  }
  return false;
}

export class MemoryRedis {
  async get(key) {
    purge(key);
    const v = store.get(String(key));
    return v == null ? null : String(v);
  }

  async set(key, value) {
    store.set(String(key), String(value));
    return "OK";
  }

  async setex(key, ttlSeconds, value) {
    store.set(String(key), String(value));
    expiry.set(String(key), Date.now() + Number(ttlSeconds) * 1000);
    return "OK";
  }

  async del(...keys) {
    let n = 0;
    for (const key of keys) {
      if (store.delete(String(key))) n += 1;
      expiry.delete(String(key));
    }
    return n;
  }

  async incr(key) {
    purge(key);
    const k = String(key);
    const next = Number(store.get(k) ?? 0) + 1;
    store.set(k, String(next));
    return next;
  }

  async expire(key, ttlSeconds) {
    if (!store.has(String(key))) return 0;
    expiry.set(String(key), Date.now() + Number(ttlSeconds) * 1000);
    return 1;
  }

  multi() {
    const ops = [];
    const self = this;
    const chain = {
      incr(k) {
        ops.push(["incr", k]);
        return chain;
      },
      expire(k, ttl) {
        ops.push(["expire", k, ttl]);
        return chain;
      },
      async exec() {
        const out = [];
        for (const op of ops) {
          if (op[0] === "incr") out.push([null, await self.incr(op[1])]);
          if (op[0] === "expire") out.push([null, await self.expire(op[1], op[2])]);
        }
        return out;
      },
    };
    return chain;
  }

  static reset() {
    store.clear();
    expiry.clear();
  }
}

export default MemoryRedis;
