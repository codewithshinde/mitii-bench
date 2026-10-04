/**
 * Dry-run solutions + node:test oracles for ecosystem Node cases (prompts 26–55).
 * Consumed by suite generators; mirrors node-backend-meta.mjs entries 26–55.
 */
import { nodeBackendMeta } from "./node-backend-meta.mjs";

const metaByN = Object.fromEntries(
  nodeBackendMeta.filter((m) => m.n >= 26 && m.n <= 55).map((m) => [m.n, m]),
);

function pickMeta(n, extraTags = []) {
  const m = metaByN[n];
  return {
    n: m.n,
    slug: m.slug,
    title: m.title,
    difficulty: m.difficulty,
    tags: [...new Set([...(m.tags ?? []), ...extraTags])],
    packages: m.packages ?? [],
    bases: m.bases ?? ["base-node"],
    gradeFile: m.gradeFile,
    markers: m.markers ?? [],
  };
}

function nodePkg(extra = {}) {
  return JSON.stringify(
    {
      name: "mitii-bench-base-node",
      version: "1.0.0",
      private: true,
      type: "module",
      scripts: {
        start: "node src/index.js",
        build: 'node -e "console.log(\'build ok\')"',
        test: "node --test test/*.test.js",
      },
      dependencies: {
        "better-sqlite3": "^11.8.1",
        express: "^4.21.2",
        ...extra,
      },
    },
    null,
    2,
  );
}

function nestPkg(extra = {}) {
  return JSON.stringify(
    {
      name: "mitii-bench-base-nest-js",
      version: "1.0.0",
      private: true,
      scripts: {
        build: "tsc -p tsconfig.json",
        start: "node dist/main.js",
        "start:dev": "tsc -p tsconfig.json && node dist/main.js",
        test: "node --test test/*.test.js",
      },
      dependencies: {
        "@nestjs/common": "^10.4.15",
        "@nestjs/core": "^10.4.15",
        "@nestjs/platform-express": "^10.4.15",
        "reflect-metadata": "^0.2.2",
        rxjs: "^7.8.1",
        ...extra,
      },
      devDependencies: {
        "@types/node": "^20.17.10",
        typescript: "^5.7.3",
      },
    },
    null,
    2,
  );
}

const MEMORY_REDIS = `/** In-memory Redis-compatible store for dry-run (no server required). */
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
`;

export const nodeEcosystemCases = [
  {
    ...pickMeta(26),
    smoke: true,
    files: {
      "package.json": nodePkg(),
      "src/errorMiddleware.js": `/** Centralized Express error middleware. */
export function errorMiddleware(err, req, res, next) {
  if (res.headersSent) return next(err);
  const status = err.statusCode || err.status || 500;
  const payload = { error: err.message, status };
  if (process.env.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack;
  }
  res.status(status).json(payload);
}
`,
      "src/index.js": `import express from "express";
import { errorMiddleware } from "./errorMiddleware.js";

export const app = express();
app.use(express.json());

app.get("/ok", (_req, res) => res.json({ ok: true }));

app.get("/boom", (_req, _res, next) => {
  const err = new Error("Something broke");
  err.statusCode = 418;
  next(err);
});

app.get("/fail", (_req, _res, next) => next(new Error("Internal failure")));

app.use(errorMiddleware);

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") {
    console.log(\`listening on \${address.port}\`);
  }
});
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { errorMiddleware } from "../src/errorMiddleware.js";

function invoke(mw, err, env = {}) {
  const prev = process.env.NODE_ENV;
  if (env.NODE_ENV) process.env.NODE_ENV = env.NODE_ENV;
  const req = {};
  const res = {
    headersSent: false,
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  let passed = false;
  mw(err, req, res, () => {
    passed = true;
  });
  if (env.NODE_ENV !== undefined) process.env.NODE_ENV = prev;
  return { res, passed };
}

describe("errorMiddleware", () => {
  it("returns JSON error and status from err.statusCode", () => {
    const err = new Error("teapot");
    err.statusCode = 418;
    const { res } = invoke(errorMiddleware, err);
    assert.equal(res.statusCode, 418);
    assert.equal(res.body.error, "teapot");
    assert.equal(res.body.status, 418);
  });

  it("defaults to 500", () => {
    const { res } = invoke(errorMiddleware, new Error("x"));
    assert.equal(res.statusCode, 500);
    assert.equal(res.body.status, 500);
  });

  it("includes stack outside production", () => {
    const err = new Error("dev");
    err.stack = "STACK";
    const { res } = invoke(errorMiddleware, err, { NODE_ENV: "development" });
    assert.equal(res.body.stack, "STACK");
  });

  it("masks stack in production", () => {
    const err = new Error("prod");
    err.stack = "SECRET";
    const { res } = invoke(errorMiddleware, err, { NODE_ENV: "production" });
    assert.equal(res.body.stack, undefined);
  });
});
`,
    http: {
      start: { command: "node src/index.js" },
      timeoutMs: 15000,
      requests: [
        {
          method: "GET",
          path: "/boom",
          expect: { status: 418, jsonSubset: { error: "Something broke", status: 418 } },
        },
        {
          method: "GET",
          path: "/fail",
          expect: { status: 500, jsonPaths: ["error", "status"] },
        },
      ],
    },
  },

  {
    ...pickMeta(27),
    smoke: false,
    files: {
      "package.json": nodePkg(),
      "src/rateLimit.js": `/** Sliding-window rate limiter (in-memory store). */
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
`,
      "src/index.js": `import express from "express";
import { rateLimitMiddleware } from "./rateLimit.js";

export const app = express();
app.set("trust proxy", true);
app.use(rateLimitMiddleware);
app.get("/ping", (_req, res) => res.json({ pong: true }));

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(\`listening on \${address.port}\`);
});
`,
    },
    oracle: `import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { rateLimitMiddleware, _resetRateLimitStore } from "../src/rateLimit.js";

function hit(n, ip = "1.2.3.4") {
  const app = express();
  app.set("trust proxy", true);
  app.use((req, _res, next) => {
    req.ip = ip;
    next();
  });
  app.use(rateLimitMiddleware);
  app.get("/", (_req, res) => res.json({ ok: true }));
  return new Promise((resolve) => {
    const server = app.listen(0, async () => {
      const port = server.address().port;
      const statuses = [];
      for (let i = 0; i < n; i++) {
        const r = await fetch(\`http://127.0.0.1:\${port}/\`);
        statuses.push({ status: r.status, limit: r.headers.get("x-ratelimit-limit"), remaining: r.headers.get("x-ratelimit-remaining"), retry: r.headers.get("retry-after") });
      }
      server.close(() => resolve(statuses));
    });
  });
}

describe("rateLimitMiddleware", () => {
  beforeEach(() => _resetRateLimitStore());

  it("allows 5 requests then blocks with headers", async () => {
    const results = await hit(6);
    assert.ok(results.slice(0, 5).every((r) => r.status === 200));
    assert.equal(results[5].status, 429);
    assert.equal(results[0].limit, "5");
    assert.ok(Number(results[4].remaining) >= 0);
    assert.ok(results[5].retry);
  });
});
`,
    http: {
      start: { command: "node src/index.js" },
      timeoutMs: 20000,
      requests: Array.from({ length: 6 }, (_, i) => ({
        method: "GET",
        path: "/ping",
        expect:
          i < 5
            ? { status: 200, headerContains: { "x-ratelimit-limit": "5" } }
            : { status: 429, headerContains: { "x-ratelimit-remaining": "0" } },
      })),
    },
  },

  {
    ...pickMeta(28),
    smoke: true,
    files: {
      "package.json": nodePkg({ zod: "^3.24.1" }),
      "src/index.js": `import express from "express";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(18),
  password: z.string().min(8),
});

export function validateUserBody(req, res, next) {
  const parsed = userSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      errors: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }
  req.validated = parsed.data;
  next();
}

export const app = express();
app.use(express.json());
app.post("/api/users", validateUserBody, (req, res) => {
  res.status(201).json({ user: req.validated });
});

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(\`listening on \${address.port}\`);
});
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { validateUserBody } from "../src/index.js";

async function post(body) {
  const app = express();
  app.use(express.json());
  app.post("/api/users", validateUserBody, (req, res) => res.status(201).json({ user: req.validated }));
  return new Promise((resolve) => {
    const server = app.listen(0, async () => {
      const port = server.address().port;
      const r = await fetch(\`http://127.0.0.1:\${port}/api/users\`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await r.json();
      server.close(() => resolve({ status: r.status, json }));
    });
  });
}

describe("zod validation", () => {
  it("accepts valid payload", async () => {
    const { status, json } = await post({ email: "a@b.com", age: 21, password: "longenough" });
    assert.equal(status, 201);
    assert.equal(json.user.email, "a@b.com");
  });

  it("returns 400 with structured errors", async () => {
    const { status, json } = await post({ email: "bad", age: 10, password: "short" });
    assert.equal(status, 400);
    assert.ok(Array.isArray(json.errors));
    assert.ok(json.errors.length >= 2);
  });
});
`,
    http: {
      start: { command: "node src/index.js" },
      timeoutMs: 15000,
      requests: [
        {
          method: "POST",
          path: "/api/users",
          json: { email: "user@example.com", age: 25, password: "securepass" },
          expect: { status: 201, jsonPaths: ["user.email"] },
        },
        {
          method: "POST",
          path: "/api/users",
          json: { email: "nope", age: 12, password: "x" },
          expect: { status: 400, jsonPaths: ["errors"] },
        },
      ],
    },
  },

  {
    ...pickMeta(29),
    smoke: false,
    files: {
      "package.json": nodePkg({ multer: "^1.4.5-lts.1" }),
      "src/index.js": `import express from "express";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ok = ["image/png", "image/jpeg"].includes(file.mimetype);
    cb(ok ? null : new Error("Invalid mime type"), ok);
  },
});

export const app = express();

app.post("/api/upload", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      const status = err.message === "Invalid mime type" || err.code === "LIMIT_FILE_SIZE" ? 400 : 500;
      return res.status(status).json({ error: err.message });
    }
    if (!req.file) return res.status(400).json({ error: "No file" });
    res.json({ filename: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype });
  });
});

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(\`listening on \${address.port}\`);
});
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("multer upload route", () => {
  it("registers POST /api/upload with multer limits", () => {
    const src = readFileSync(new URL("../src/index.js", import.meta.url));
    const text = src.toString("utf8");
    assert.match(text, /multer/);
    assert.match(text, /2 \\* 1024 \\* 1024/);
    assert.match(text, /image\\/png/);
    assert.match(text, /\\/api\\/upload/);
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(30),
    smoke: false,
    files: {
      "package.json": nodePkg({ jsonwebtoken: "^9.0.2" }),
      "src/authenticateToken.js": `import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "mitii-test-secret";

export function authenticateToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}
`,
      "src/index.js": `import express from "express";
import { authenticateToken, signToken } from "./authenticateToken.js";

export const app = express();
app.use(express.json());
app.post("/login", (req, res) => {
  const token = signToken({ sub: req.body.username || "demo", role: "user" });
  res.json({ token });
});
app.get("/protected", authenticateToken, (req, res) => res.json({ user: req.user }));

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(\`listening on \${address.port}\`);
});
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { authenticateToken, signToken } from "../src/authenticateToken.js";

describe("authenticateToken", () => {
  it("populates req.user for valid Bearer token", async () => {
    const token = signToken({ sub: "u1" });
    const app = express();
    app.get("/", authenticateToken, (req, res) => res.json({ id: req.user.sub }));
    const out = await new Promise((resolve) => {
      const server = app.listen(0, async () => {
        const port = server.address().port;
        const r = await fetch(\`http://127.0.0.1:\${port}/\`, { headers: { authorization: \`Bearer \${token}\` } });
        const json = await r.json();
        server.close(() => resolve({ status: r.status, json }));
      });
    });
    assert.equal(out.status, 200);
    assert.equal(out.json.id, "u1");
  });

  it("returns 401 without token", async () => {
    const app = express();
    app.get("/", authenticateToken, (_req, res) => res.json({ ok: true }));
    const out = await new Promise((resolve) => {
      const server = app.listen(0, async () => {
        const port = server.address().port;
        const r = await fetch(\`http://127.0.0.1:\${port}/\`);
        server.close(() => resolve(r.status));
      });
    });
    assert.equal(out, 401);
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(31),
    smoke: false,
    files: {
      "package.json": nodePkg(),
      "src/routes/products.js": `import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => res.json({ items: [{ id: 1, name: "Widget" }] }));
export default router;
`,
      "src/routes/orders.js": `import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => res.json({ items: [{ id: 99, total: 42 }] }));
export default router;
`,
      "src/index.js": `import express from "express";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";

export const app = express();
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/orders", ordersRouter);

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(\`listening on \${address.port}\`);
});
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import productsRouter from "../src/routes/products.js";
import ordersRouter from "../src/routes/orders.js";

describe("modular routers", () => {
  it("products and orders routers respond", async () => {
    const app = express();
    app.use("/api/v1/products", productsRouter);
    app.use("/api/v1/orders", ordersRouter);
    const port = await new Promise((resolve) => {
      const server = app.listen(0, () => resolve(server.address().port));
    });
    const p = await fetch(\`http://127.0.0.1:\${port}/api/v1/products\`);
    const o = await fetch(\`http://127.0.0.1:\${port}/api/v1/orders\`);
    assert.equal(p.status, 200);
    assert.equal(o.status, 200);
    const pj = await p.json();
    const oj = await o.json();
    assert.ok(Array.isArray(pj.items));
    assert.ok(Array.isArray(oj.items));
  });
});
`,
    http: {
      start: { command: "node src/index.js" },
      timeoutMs: 15000,
      requests: [
        { method: "GET", path: "/api/v1/products", expect: { status: 200, jsonPaths: ["items"] } },
        { method: "GET", path: "/api/v1/orders", expect: { status: 200, jsonPaths: ["items"] } },
      ],
    },
  },

  {
    ...pickMeta(32),
    smoke: false,
    files: {
      "package.json": nodePkg(),
      "src/corsMiddleware.js": `const ALLOWED_METHODS = "GET, POST, PUT, DELETE";
const EXPOSED = "X-Total-Count";

function originAllowed(origin) {
  if (!origin) return true;
  try {
    const { hostname } = new URL(origin);
    return hostname === "example.com" || hostname.endsWith(".example.com");
  } catch {
    return false;
  }
}

export function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  if (origin && originAllowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", ALLOWED_METHODS);
  res.setHeader("Access-Control-Expose-Headers", EXPOSED);
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
}
`,
      "src/index.js": `import express from "express";
import { corsMiddleware } from "./corsMiddleware.js";

export const app = express();
app.use(corsMiddleware);
app.get("/data", (_req, res) => {
  res.setHeader("X-Total-Count", "10");
  res.json({ rows: [] });
});

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(\`listening on \${address.port}\`);
});
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { corsMiddleware } from "../src/corsMiddleware.js";

describe("corsMiddleware", () => {
  it("allows *.example.com origins", async () => {
    const app = express();
    app.use(corsMiddleware);
    app.get("/", (_req, res) => res.end("ok"));
    const headers = await new Promise((resolve) => {
      const server = app.listen(0, async () => {
        const port = server.address().port;
        const r = await fetch(\`http://127.0.0.1:\${port}/\`, { headers: { origin: "https://app.example.com" } });
        server.close(() => resolve(Object.fromEntries(r.headers.entries())));
      });
    });
    assert.equal(headers["access-control-allow-origin"], "https://app.example.com");
    assert.match(headers["access-control-allow-methods"], /GET/);
    assert.match(headers["access-control-expose-headers"], /X-Total-Count/);
  });
});
`,
    http: {
      start: { command: "node src/index.js", env: { ORIGIN: "https://app.example.com" } },
      timeoutMs: 15000,
      requests: [
        {
          method: "GET",
          path: "/data",
          headers: { Origin: "https://shop.example.com" },
          expect: {
            status: 200,
            headers: { "access-control-allow-origin": "https://shop.example.com" },
            headerContains: { "access-control-expose-headers": "X-Total-Count" },
          },
        },
      ],
    },
  },

  {
    ...pickMeta(33),
    smoke: false,
    files: {
      "package.json": nodePkg({ prisma: "^6.1.0", "@prisma/client": "^6.1.0" }),
      "src/prismaClient.js": `import Database from "better-sqlite3";

const db = new Database(":memory:");
db.exec(\`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    balance REAL NOT NULL DEFAULT 0
  );
  INSERT INTO users (id, name, balance) VALUES (1, 'Alice', 100), (2, 'Bob', 50);
\`);

/** Prisma-shaped client backed by SQLite for dry-run. */
export const prisma = {
  user: {
    findUnique({ where: { id } }) {
      return db.prepare("SELECT id, name, balance FROM users WHERE id = ?").get(id) ?? null;
    },
    update({ where: { id }, data: { balance } }) {
      db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(balance, id);
      return prisma.user.findUnique({ where: { id } });
    },
  },
  async $transaction(fn) {
    const tx = db.transaction(() => fn(prisma));
    return tx();
  },
};
`,
      "src/transferBalance.js": `import { prisma } from "./prismaClient.js";

export async function transferBalance(fromUserId, toUserId, amount) {
  if (amount <= 0) throw new Error("Amount must be positive");
  return prisma.$transaction(async (tx) => {
    const from = await tx.user.findUnique({ where: { id: fromUserId } });
    const to = await tx.user.findUnique({ where: { id: toUserId } });
    if (!from || !to) throw new Error("User not found");
    if (from.balance < amount) throw new Error("Insufficient funds");
    await tx.user.update({ where: { id: fromUserId }, data: { balance: from.balance - amount } });
    await tx.user.update({ where: { id: toUserId }, data: { balance: to.balance + amount } });
    return { from: fromUserId, to: toUserId, amount };
  });
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { transferBalance } from "../src/transferBalance.js";
import { prisma } from "../src/prismaClient.js";

describe("transferBalance", () => {
  it("moves funds atomically inside $transaction", async () => {
    await transferBalance(1, 2, 25);
    const alice = prisma.user.findUnique({ where: { id: 1 } });
    const bob = prisma.user.findUnique({ where: { id: 2 } });
    assert.equal(alice.balance, 75);
    assert.equal(bob.balance, 75);
  });

  it("rejects insufficient balance", async () => {
    await assert.rejects(() => transferBalance(1, 2, 9999), /Insufficient funds/);
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(34),
    smoke: false,
    files: {
      "package.json": nodePkg({ prisma: "^6.1.0", "@prisma/client": "^6.1.0" }),
      "src/productSearch.js": `const PRODUCTS = [
  { id: 1, name: "Alpha Phone", category: "electronics", price: 699 },
  { id: 2, name: "Beta Book", category: "books", price: 19 },
  { id: 3, name: "Gamma Gadget", category: "electronics", price: 49 },
  { id: 4, name: "Delta Desk", category: "furniture", price: 199 },
];

/** Prisma-style paginated product search (in-memory). */
export async function searchProducts({ page = 1, limit = 10, category, search } = {}) {
  let rows = [...PRODUCTS];
  if (category) rows = rows.filter((p) => p.category === category);
  if (search) {
    const q = String(search).toLowerCase();
    rows = rows.filter((p) => p.name.toLowerCase().includes(q));
  }
  const totalCount = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const currentPage = Math.min(Math.max(1, Number(page)), totalPages);
  const start = (currentPage - 1) * limit;
  const items = rows.slice(start, start + limit);
  return { items, totalCount, totalPages, currentPage };
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { searchProducts } from "../src/productSearch.js";

describe("searchProducts", () => {
  it("filters by category and search with pagination metadata", async () => {
    const out = await searchProducts({ page: 1, limit: 1, category: "electronics", search: "a" });
    assert.equal(out.items.length, 1);
    assert.ok(out.totalCount >= 1);
    assert.equal(out.currentPage, 1);
    assert.ok(out.totalPages >= 1);
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(35),
    smoke: false,
    files: {
      "package.json": nodePkg({ mongoose: "^8.9.3" }),
      "src/models/User.js": `import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual("fullName").get(function fullName() {
  return \`\${this.firstName} \${this.lastName}\`.trim();
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import User from "../src/models/User.js";

describe("User virtual fullName", () => {
  it("concatenates names and serializes virtuals", () => {
    const u = new User({ firstName: "Ada", lastName: "Lovelace" });
    assert.equal(u.fullName, "Ada Lovelace");
    const json = u.toJSON();
    assert.equal(json.fullName, "Ada Lovelace");
    assert.equal(json.firstName, "Ada");
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(36),
    smoke: false,
    files: {
      "package.json": nodePkg({ typeorm: "^0.3.20" }),
      "src/entities/Author.ts": `/** TypeORM-style Author entity (dry-run; decorators as metadata strings). */
export class Author {
  id = 0;
  name = "";
  // @OneToMany(() => Post, (post) => post.author, { cascade: true })
  posts = [];
}

export const AuthorMeta = {
  entity: "Author",
  relations: [{ type: "OneToMany", target: "Post", cascade: true }],
};
`,
      "src/entities/Post.ts": `import type { Author } from "./Author.js";

export class Post {
  id = 0;
  title = "";
  author = null;
  // @ManyToOne(() => Author, (author) => author.posts, { onDelete: "CASCADE" })
}

export const PostMeta = { entity: "Post", cascadeDelete: true };
`,
      "src/entityStore.js": `import { Author } from "./entities/Author.js";
import { Post } from "./entities/Post.js";

const authors = new Map();
const posts = new Map();
let nextAuthor = 1;
let nextPost = 1;

export function createAuthor(name) {
  const a = new Author();
  a.id = nextAuthor++;
  a.name = name;
  authors.set(a.id, a);
  return a;
}

export function createPost(authorId, title) {
  const author = authors.get(authorId);
  if (!author) throw new Error("Author not found");
  const p = new Post();
  p.id = nextPost++;
  p.title = title;
  p.author = author;
  author.posts.push(p);
  posts.set(p.id, p);
  return p;
}

export function deleteAuthor(id) {
  const author = authors.get(id);
  if (!author) return false;
  for (const post of author.posts) posts.delete(post.id);
  authors.delete(id);
  return true;
}

export function getAuthor(id) {
  return authors.get(id) ?? null;
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createAuthor, createPost, deleteAuthor, getAuthor } from "../src/entityStore.js";

describe("Author/Post relationship", () => {
  it("Author entity declares OneToMany cascade", () => {
    const src = readFileSync(new URL("../src/entities/Author.ts", import.meta.url), "utf8");
    assert.match(src, /OneToMany/);
    assert.match(src, /cascade/);
    assert.match(src, /Author/);
  });

  it("cascade delete removes posts", () => {
    const author = createAuthor("Turing");
    createPost(author.id, "Post A");
    createPost(author.id, "Post B");
    deleteAuthor(author.id);
    assert.equal(getAuthor(author.id), null);
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(37),
    smoke: false,
    files: {
      "package.json": nodePkg({ knex: "^3.1.0" }),
      "migrations/001_orders.js": `/** @param {import('knex').Knex} knex */
export async function up(knex) {
  await knex.schema.createTable("orders", (table) => {
    table.increments("id").primary();
    table.integer("user_id").notNullable();
    table.decimal("total", 14, 2).notNullable();
    table.string("status").notNullable().defaultTo("pending");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

/** @param {import('knex').Knex} knex */
export async function down(knex) {
  await knex.schema.dropTableIfExists("orders");
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("orders migration", () => {
  it("defines up/down for orders table", () => {
    const src = readFileSync(new URL("../migrations/001_orders.js", import.meta.url), "utf8");
    assert.match(src, /orders/);
    assert.match(src, /export async function up/);
    assert.match(src, /export async function down/);
    assert.match(src, /user_id/);
    assert.match(src, /created_at/);
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(38),
    smoke: false,
    files: {
      "package.json": nodePkg({ "socket.io": "^4.8.1", "socket.io-client": "^4.8.1" }),
      "src/chat.js": `import { Server } from "socket.io";
import http from "node:http";

export function createChatServer() {
  const httpServer = http.createServer();
  const io = new Server(httpServer, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("join-room", ({ roomId }) => {
      socket.join(String(roomId));
    });

    socket.on("send-message", ({ roomId, message }) => {
      io.to(String(roomId)).emit("message", { roomId, message, from: socket.id });
    });
  });

  return { httpServer, io };
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { io as ioClient } from "socket.io-client";
import { createChatServer } from "../src/chat.js";

describe("socket.io rooms", () => {
  it("broadcasts messages only within a room", async () => {
    const { httpServer } = createChatServer();
    await new Promise((resolve) => httpServer.listen(0, resolve));
    const port = httpServer.address().port;
    const url = \`http://127.0.0.1:\${port}\`;

    const a = ioClient(url, { transports: ["websocket"] });
    const b = ioClient(url, { transports: ["websocket"] });
    const c = ioClient(url, { transports: ["websocket"] });

    await Promise.all([
      new Promise((r) => a.on("connect", r)),
      new Promise((r) => b.on("connect", r)),
      new Promise((r) => c.on("connect", r)),
    ]);

    a.emit("join-room", { roomId: "r1" });
    b.emit("join-room", { roomId: "r1" });
    c.emit("join-room", { roomId: "r2" });

    await new Promise((r) => setTimeout(r, 50));

    const received = [];
    b.on("message", (m) => received.push(m));
    c.on("message", (m) => received.push({ wrongRoom: true, ...m }));

    a.emit("send-message", { roomId: "r1", message: "hello" });
    await new Promise((r) => setTimeout(r, 100));

    assert.ok(received.some((m) => m.message === "hello" && m.roomId === "r1"));
    assert.ok(!received.some((m) => m.wrongRoom));

    a.close();
    b.close();
    c.close();
    httpServer.close();
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(39),
    smoke: false,
    files: {
      "package.json": nodePkg({
        "socket.io": "^4.8.1",
        "socket.io-client": "^4.8.1",
        jsonwebtoken: "^9.0.2",
      }),
      "src/socketAuth.js": `import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import http from "node:http";

const SECRET = process.env.JWT_SECRET || "socket-secret";

export function attachSocketAuth(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));
    try {
      socket.user = jwt.verify(token, SECRET);
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });
  return io;
}

export function createAuthedServer() {
  const httpServer = http.createServer();
  const io = attachSocketAuth(new Server(httpServer));
  io.on("connection", (socket) => {
    socket.emit("ready", { sub: socket.user.sub });
  });
  return { httpServer, io, sign: (payload) => jwt.sign(payload, SECRET) };
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { io as ioClient } from "socket.io-client";
import { createAuthedServer } from "../src/socketAuth.js";

describe("socket auth handshake", () => {
  it("rejects missing token and accepts valid JWT", async () => {
    const { httpServer, sign } = createAuthedServer();
    await new Promise((r) => httpServer.listen(0, r));
    const port = httpServer.address().port;
    const url = \`http://127.0.0.1:\${port}\`;

    const bad = ioClient(url, { transports: ["websocket"], auth: {} });
    const badResult = await new Promise((resolve) => {
      bad.on("connect_error", (err) => resolve(err.message));
      bad.on("connect", () => resolve("connected"));
    });
    assert.match(String(badResult), /Unauthorized|xhr poll/i);
    bad.close();

    const token = sign({ sub: "user-42" });
    const good = ioClient(url, { transports: ["websocket"], auth: { token } });
    const payload = await new Promise((resolve) => {
      good.on("ready", resolve);
    });
    assert.equal(payload.sub, "user-42");
    good.close();
    httpServer.close();
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(40),
    smoke: false,
    files: {
      "package.json": nodePkg({ bullmq: "^5.34.5", ioredis: "^5.4.2" }),
      "src/memoryRedis.js": MEMORY_REDIS,
      "src/emailQueue.js": `import MemoryRedis from "./memoryRedis.js";

/** BullMQ-shaped email queue using in-memory Redis for dry-run. */
const connection = new MemoryRedis();
const jobs = [];
let jobId = 0;

export const emailQueue = {
  name: "emailQueue",
  async add(name, data, opts = {}) {
    const id = String(++jobId);
    const job = {
      id,
      name,
      data,
      opts: { attempts: opts.attempts ?? 3, backoff: opts.backoff ?? { type: "exponential", delay: 1000 } },
      attemptsMade: 0,
    };
    jobs.push(job);
    return job;
  },
  _jobs() {
    return jobs;
  },
};

export function createEmailWorker(processor, { concurrency = 5 } = {}) {
  let active = 0;
  const queue = [...jobs];
  async function drain() {
    while (queue.length && active < concurrency) {
      const job = queue.shift();
      active += 1;
      try {
        await processor(job);
      } catch (err) {
        job.attemptsMade += 1;
        if (job.attemptsMade < (job.opts.attempts ?? 3)) {
          queue.push(job);
        } else {
          job.failedReason = err.message;
        }
      } finally {
        active -= 1;
      }
    }
  }
  return {
    connection,
    async run() {
      await drain();
    },
    getFailed() {
      return jobs.filter((j) => j.failedReason);
    },
  };
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { emailQueue, createEmailWorker } from "../src/emailQueue.js";

describe("emailQueue", () => {
  it("processes jobs with retry/backoff settings", async () => {
    await emailQueue.add(
      "send",
      { to: "a@b.com" },
      { attempts: 3, backoff: { type: "exponential", delay: 10 } },
    );
    const processed = [];
    const worker = createEmailWorker(async (job) => {
      processed.push(job.data.to);
    }, { concurrency: 5 });
    await worker.run();
    assert.deepEqual(processed, ["a@b.com"]);
    const job = emailQueue._jobs()[0];
    assert.equal(job.opts.attempts, 3);
    assert.equal(job.opts.backoff.type, "exponential");
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(41),
    smoke: false,
    files: {
      "package.json": nodePkg({ ioredis: "^5.4.2" }),
      "src/memoryRedis.js": MEMORY_REDIS,
      "src/cacheMiddleware.js": `import MemoryRedis from "./memoryRedis.js";

const redis = new MemoryRedis();
const TTL = 60;

function cacheKey(req) {
  return \`cache:\${req.originalUrl}\`;
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
`,
      "src/index.js": `import express from "express";
import { cacheMiddleware } from "./cacheMiddleware.js";

export const app = express();
app.use(cacheMiddleware);
app.get("/api/items", (_req, res) => res.json({ items: [1, 2, 3] }));

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(\`listening on \${address.port}\`);
});
`,
    },
    oracle: `import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import MemoryRedis from "../src/memoryRedis.js";
import { cacheMiddleware } from "../src/cacheMiddleware.js";

describe("cacheMiddleware", () => {
  beforeEach(() => MemoryRedis.reset());

  it("caches JSON responses by originalUrl", async () => {
    let hits = 0;
    const app = express();
    app.use(cacheMiddleware);
    app.get("/api/x", (_req, res) => {
      hits += 1;
      res.json({ n: hits });
    });
    const port = await new Promise((resolve) => {
      const server = app.listen(0, () => resolve(server.address().port));
    });
    const url = \`http://127.0.0.1:\${port}/api/x?a=1\`;
    const r1 = await fetch(url);
    const j1 = await r1.json();
    const r2 = await fetch(url);
    const j2 = await r2.json();
    assert.equal(j1.n, 1);
    assert.equal(j2.n, 1);
    assert.equal(r2.headers.get("x-cache"), "HIT");
  });
});
`,
    http: {
      start: { command: "node src/index.js" },
      timeoutMs: 15000,
      requests: [
        { method: "GET", path: "/api/items", expect: { status: 200, headerContains: { "x-cache": "MISS" } } },
        { method: "GET", path: "/api/items", expect: { status: 200, headerContains: { "x-cache": "HIT" } } },
      ],
    },
  },

  {
    ...pickMeta(42),
    smoke: false,
    files: {
      "package.json": nodePkg({ fastify: "^5.2.1" }),
      "src/server.js": `import Fastify from "fastify";

export async function buildServer() {
  const app = Fastify({ logger: false });
  app.post(
    "/items",
    {
      schema: {
        body: {
          type: "object",
          required: ["name", "qty"],
          properties: { name: { type: "string" }, qty: { type: "integer", minimum: 1 } },
        },
        response: {
          201: {
            type: "object",
            properties: { id: { type: "integer" }, name: { type: "string" }, qty: { type: "integer" } },
          },
        },
      },
    },
    async (req) => ({ id: 1, ...req.body }),
  );
  return app;
}

const port = Number(process.env.PORT || 0);
const app = await buildServer();
await app.listen({ port, host: "127.0.0.1" });
console.log(\`listening on \${port}\`);
export { app };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildServer } from "../src/server.js";

describe("fastify schema route", () => {
  it("validates body and returns typed response", async () => {
    const app = await buildServer();
    await app.ready();
    const ok = await app.inject({ method: "POST", url: "/items", payload: { name: "Pen", qty: 2 } });
    assert.equal(ok.statusCode, 200);
    const body = ok.json();
    assert.equal(body.name, "Pen");
    assert.equal(body.qty, 2);

    const bad = await app.inject({ method: "POST", url: "/items", payload: { name: "Pen", qty: 0 } });
    assert.equal(bad.statusCode, 400);
    await app.close();
  });
});
`,
    http: {
      start: { command: "node src/server.js" },
      timeoutMs: 15000,
      requests: [
        {
          method: "POST",
          path: "/items",
          json: { name: "Widget", qty: 3 },
          expect: { status: 200, jsonSubset: { name: "Widget", qty: 3 } },
        },
      ],
    },
  },

  {
    ...pickMeta(43),
    smoke: false,
    files: {
      "package.json": nodePkg({ fastify: "^5.2.1", "fastify-plugin": "^5.0.1" }),
      "src/dbPlugin.js": `import fp from "fastify-plugin";

async function dbPlugin(fastify) {
  const db = {
    query(sql) {
      return { sql, rows: [] };
    },
  };
  fastify.decorate("db", db);
}

export default fp(dbPlugin, { name: "db-plugin" });
`,
      "src/server.js": `import Fastify from "fastify";
import dbPlugin from "./dbPlugin.js";

export async function buildServer() {
  const app = Fastify({ logger: false });
  await app.register(dbPlugin);
  app.get("/db-check", async (req) => req.server.db.query("SELECT 1"));
  return app;
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildServer } from "../src/server.js";

describe("fastify db plugin", () => {
  it("decorates fastify.db via fastify-plugin", async () => {
    const app = await buildServer();
    await app.ready();
    assert.equal(typeof app.db.query, "function");
    const res = await app.inject({ method: "GET", url: "/db-check" });
    assert.equal(res.statusCode, 200);
    assert.equal(res.json().sql, "SELECT 1");
    await app.close();
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(44),
    smoke: true,
    files: {
      "package.json": nestPkg(),
      "src/users/users.service.ts": `import { Injectable } from "@nestjs/common";

export interface User {
  id: number;
  email: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [{ id: 1, email: "demo@example.com" }];
  private nextId = 2;

  findAll(): User[] {
    return this.users;
  }

  create(email: string): User {
    const user = { id: this.nextId++, email };
    this.users.push(user);
    return user;
  }
}
`,
      "src/users/users.controller.ts": `import { Body, Controller, Get, Post } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body("email") email: string) {
    return this.usersService.create(email);
  }
}
`,
      "src/users/users.module.ts": `import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
`,
      "src/app.module.ts": `import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("UsersController", () => {
  it("declares GET/POST users with injected service", () => {
    const ctrl = readFileSync("src/users/users.controller.ts", "utf8");
    const svc = readFileSync("src/users/users.service.ts", "utf8");
    assert.match(ctrl, /UsersController/);
    assert.match(ctrl, /@Get\(\)/);
    assert.match(ctrl, /@Post\(\)/);
    assert.match(ctrl, /UsersService/);
    assert.match(svc, /findAll/);
    assert.match(svc, /create/);
  });
});
`,
    http: {
      start: { command: "npm run start:dev" },
      timeoutMs: 30000,
      requests: [
        { method: "GET", path: "/users", expect: { status: 200, jsonType: "array" } },
        {
          method: "POST",
          path: "/users",
          json: { email: "new@example.com" },
          headers: { "content-type": "application/json" },
          expect: { status: 201, jsonSubset: { email: "new@example.com" } },
        },
      ],
    },
  },

  {
    ...pickMeta(45),
    smoke: false,
    files: {
      "package.json": nestPkg(),
      "src/auth/roles.decorator.ts": `import { SetMetadata } from "@nestjs/common";
export const ROLES_KEY = "roles";
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
`,
      "src/auth/roles.guard.ts": `import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user as { role?: string } | undefined;
    return Boolean(user?.role && roles.includes(user.role));
  }
}
`,
      "src/admin/admin.controller.ts": `import { Controller, Get, UseGuards } from "@nestjs/common";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";

@Controller("admin")
@UseGuards(RolesGuard)
export class AdminController {
  @Get("stats")
  @Roles("admin")
  stats() {
    return { ok: true };
  }
}
`,
      "src/app.module.ts": `import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AdminController } from "./admin/admin.controller";
import { RolesGuard } from "./auth/roles.guard";

@Module({
  controllers: [AppController, AdminController],
  providers: [AppService, RolesGuard, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("RolesGuard", () => {
  it("implements CanActivate with @Roles admin metadata", () => {
    const guard = readFileSync("src/auth/roles.guard.ts", "utf8");
    const dec = readFileSync("src/auth/roles.decorator.ts", "utf8");
    assert.match(guard, /CanActivate/);
    assert.match(guard, /Roles/);
    assert.match(dec, /admin/);
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(46),
    smoke: false,
    files: {
      "package.json": nestPkg(),
      "src/filters/http-exception.filter.ts": `import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const status = exception.getStatus();
    const response = exception.getResponse();
    const message = typeof response === "string" ? response : (response as { message?: string }).message;
    res.status(status).json({
      success: false,
      statusCode: status,
      message: message ?? exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
`,
      "src/app.module.ts": `import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HttpExceptionFilter } from "./filters/http-exception.filter";

@Module({
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("HttpExceptionFilter", () => {
  it("catches HttpException with custom payload shape", () => {
    const src = readFileSync("src/filters/http-exception.filter.ts", "utf8");
    assert.match(src, /ExceptionFilter/);
    assert.match(src, /HttpException/);
    assert.match(src, /Catch/);
    assert.match(src, /success: false/);
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(47),
    smoke: false,
    files: {
      "package.json": nestPkg(),
      "src/interceptors/transform.interceptor.ts": `import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => ({
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
`,
      "src/app.module.ts": `import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TransformInterceptor } from "./interceptors/transform.interceptor";

@Module({
  controllers: [AppController],
  providers: [AppService, { provide: APP_INTERCEPTOR, useClass: TransformInterceptor }],
})
export class AppModule {}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("TransformInterceptor", () => {
  it("wraps responses with data and timestamp", () => {
    const src = readFileSync("src/interceptors/transform.interceptor.ts", "utf8");
    assert.match(src, /NestInterceptor/);
    assert.match(src, /timestamp/);
    assert.match(src, /data/);
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(48),
    smoke: false,
    files: {
      "package.json": nodePkg({
        passport: "^0.7.0",
        "passport-google-oauth20": "^2.0.0",
        "express-session": "^1.18.1",
      }),
      "src/auth/google.js": `import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export function configureGoogleAuth() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "client",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "secret",
        callbackURL: "/auth/google/callback",
      },
      (_accessToken, _refreshToken, profile, done) => {
        done(null, { id: profile.id, email: profile.emails?.[0]?.value });
      },
    ),
  );
  return passport;
}
`,
      "src/index.js": `import express from "express";
import session from "express-session";
import { configureGoogleAuth } from "./auth/google.js";

const passport = configureGoogleAuth();
export const app = express();
app.use(session({ secret: "mitii", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (_req, res) => {
  res.json({ ok: true });
});

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(\`listening on \${address.port}\`);
});
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("Google OAuth routes", () => {
  it("registers /auth/google and callback with GoogleStrategy", () => {
    const auth = readFileSync("src/auth/google.js", "utf8");
    const idx = readFileSync("src/index.js", "utf8");
    assert.match(auth, /GoogleStrategy/);
    assert.match(idx, /\\/auth\\/google/);
    assert.match(idx, /\\/auth\\/google\\/callback/);
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(49),
    smoke: false,
    files: {
      "package.json": nodePkg({ jose: "^5.9.6" }),
      "src/tokens.js": `import * as jose from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "refresh-secret");
const refreshStore = new Map();

export async function issueTokenPair(sub) {
  const access = await new jose.SignJWT({ sub })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(secret);
  const refresh = crypto.randomUUID();
  refreshStore.set(refresh, { sub, revoked: false });
  return { accessToken: access, refreshToken: refresh };
}

export async function refreshTokens(refreshToken) {
  const entry = refreshStore.get(refreshToken);
  if (!entry || entry.revoked) throw new Error("Invalid refresh token");
  entry.revoked = true;
  return issueTokenPair(entry.sub);
}

export function revokeRefreshToken(refreshToken) {
  const entry = refreshStore.get(refreshToken);
  if (entry) entry.revoked = true;
}
`,
      "src/index.js": `import express from "express";
import { refreshTokens } from "./tokens.js";

export const app = express();
app.use(express.json());
app.post("/token/refresh", async (req, res) => {
  try {
    const tokens = await refreshTokens(req.body.refreshToken);
    res.json(tokens);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(\`listening on \${address.port}\`);
});
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { issueTokenPair, refreshTokens } from "../src/tokens.js";

describe("refresh token rotation", () => {
  it("issues pair and rotates refresh token", async () => {
    const first = await issueTokenPair("user-1");
    assert.ok(first.accessToken);
    assert.ok(first.refreshToken);
    const second = await refreshTokens(first.refreshToken);
    assert.notEqual(second.refreshToken, first.refreshToken);
    await assert.rejects(() => refreshTokens(first.refreshToken), /Invalid refresh token/);
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(50),
    smoke: false,
    files: {
      "package.json": nodePkg({ "@apollo/server": "^4.11.2", graphql: "^16.10.0" }),
      "src/graphql.js": `import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const users = [{ id: "1", name: "Ada" }];

export const typeDefs = \`#graphql
  type User { id: ID! name: String! }
  type Query { user(id: ID!): User }
\`;

export const resolvers = {
  Query: {
    user: (_parent, { id }) => users.find((u) => u.id === id) ?? null,
  },
};

export async function startGraphServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, { listen: { port: Number(process.env.PORT || 0) } });
  return { server, url };
}

if (process.env.MITII_NO_LISTEN !== "1") {
  await startGraphServer();
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { typeDefs, resolvers } from "../src/graphql.js";

describe("Apollo user query", () => {
  it("defines user query resolver", async () => {
    assert.match(typeDefs, /user\\(id: ID!\\): User/);
    const user = await resolvers.Query.user(null, { id: "1" });
    assert.equal(user.name, "Ada");
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(51),
    smoke: false,
    files: {
      "package.json": nodePkg({ dataloader: "^2.2.3" }),
      "src/loaders/authorLoader.js": `import DataLoader from "dataloader";

const AUTHORS = {
  1: { id: 1, name: "Turing" },
  2: { id: 2, name: "Lovelace" },
};

export function createAuthorLoader() {
  return new DataLoader(async (ids) => {
    return ids.map((id) => AUTHORS[id] ?? null);
  });
}

export async function loadAuthorsForPosts(posts, loader) {
  return Promise.all(posts.map((p) => loader.load(p.authorId)));
}
`,
      "src/batchDemo.js": `import { createAuthorLoader, loadAuthorsForPosts } from "./loaders/authorLoader.js";

export async function fetchPostsWithAuthors(posts) {
  const loader = createAuthorLoader();
  const authors = await loadAuthorsForPosts(posts, loader);
  return posts.map((p, i) => ({ ...p, author: authors[i] }));
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fetchPostsWithAuthors } from "../src/batchDemo.js";

describe("author DataLoader", () => {
  it("batches author loads for posts", async () => {
    const posts = [
      { id: 1, authorId: 1 },
      { id: 2, authorId: 2 },
      { id: 3, authorId: 1 },
    ];
    const out = await fetchPostsWithAuthors(posts);
    assert.equal(out[0].author.name, "Turing");
    assert.equal(out[2].author.name, "Turing");
    assert.equal(out[1].author.name, "Lovelace");
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(52),
    smoke: false,
    files: {
      "package.json": nodePkg({ commander: "^12.1.0" }),
      "src/cli.js": `#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();
program
  .command("db:seed")
  .option("--count <number>", "records to seed", "10")
  .action((opts) => {
    const count = Number(opts.count);
    console.log(JSON.stringify({ command: "db:seed", count, seeded: count }));
  });

program.parse(process.argv);
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("commander db:seed", () => {
  it("parses --count flag", () => {
    const r = spawnSync(process.execPath, [join(root, "src/cli.js"), "db:seed", "--count", "3"], {
      encoding: "utf8",
    });
    assert.equal(r.status, 0);
    const out = JSON.parse(r.stdout.trim());
    assert.equal(out.command, "db:seed");
    assert.equal(out.count, 3);
    assert.equal(out.seeded, 3);
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(53),
    smoke: false,
    files: {
      "package.json": nodePkg({ winston: "^3.17.0" }),
      "src/logger.js": `import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  );
}

export default logger;
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("winston logger", () => {
  it("configures error.log and combined.log transports", () => {
    const src = readFileSync("src/logger.js", "utf8");
    assert.match(src, /winston/);
    assert.match(src, /error\\.log/);
    assert.match(src, /combined\\.log/);
    assert.match(src, /Console/);
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(54),
    smoke: false,
    files: {
      "package.json": nodePkg({ zod: "^3.24.1" }),
      "src/config.js": `import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().positive(),
});

export function loadConfig(env = process.env) {
  const parsed = schema.safeParse(env);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => \`\${i.path.join(".")}: \${i.message}\`).join("; ");
    throw new Error(\`Invalid environment configuration: \${msg}\`);
  }
  return parsed.data;
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

describe("loadConfig", () => {
  it("accepts valid DATABASE_URL and PORT", () => {
    const cfg = loadConfig({ DATABASE_URL: "https://db.example.com/main", PORT: "3000" });
    assert.equal(cfg.PORT, 3000);
  });

  it("throws descriptive error for missing vars", () => {
    assert.throws(() => loadConfig({}), /Invalid environment configuration/);
    assert.throws(
      () => loadConfig({ DATABASE_URL: "not-a-url", PORT: "0" }),
      /DATABASE_URL|PORT/,
    );
  });
});
`,
    http: null,
  },

  {
    ...pickMeta(55),
    smoke: false,
    files: {
      "package.json": nodePkg({ "swagger-ui-express": "^5.0.1" }),
      "src/index.js": `import express from "express";
import swaggerUi from "swagger-ui-express";

const spec = {
  openapi: "3.0.0",
  info: { title: "Mitii API", version: "1.0.0" },
  paths: { "/health": { get: { summary: "Health", responses: { 200: { description: "OK" } } } } },
};

export const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(\`listening on \${address.port}\`);
});
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("swagger docs", () => {
  it("serves swagger UI at /api-docs", () => {
    const src = readFileSync("src/index.js", "utf8");
    assert.match(src, /swagger-ui-express/);
    assert.match(src, /\\/api-docs/);
    assert.match(src, /openapi/);
  });
});
`,
    http: {
      start: { command: "node src/index.js" },
      timeoutMs: 15000,
      requests: [
        { method: "GET", path: "/api-docs/", expect: { status: 200, bodyContains: "swagger" } },
        { method: "GET", path: "/health", expect: { status: 200, jsonSubset: { status: "ok" } } },
      ],
    },
  },
];
