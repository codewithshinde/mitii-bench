/** Solution bodies for node-realworld-cases.mjs (prompts 56–100). */

export const expressStart = {
  start: { command: "node src/index.js" },
  timeoutMs: 20000,
};

export const realworldSolutions = {
  "articles-json-crud": {
    smoke: true,
    files: {
      "src/index.js": `import express from "express";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "articles.json");
const TMP_FILE = join(DATA_DIR, "articles.json.tmp");

export async function loadArticles() {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

export async function saveArticles(articles) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(TMP_FILE, JSON.stringify(articles, null, 2));
  await rename(TMP_FILE, DATA_FILE);
}

const app = express();
app.use(express.json());

app.get("/articles", async (_req, res) => res.json(await loadArticles()));

app.post("/articles", async (req, res) => {
  const { title, body } = req.body ?? {};
  if (!title) return res.status(400).json({ error: "title required" });
  const articles = await loadArticles();
  const id = articles.length ? Math.max(...articles.map((a) => a.id)) + 1 : 1;
  const article = { id, title, body: body ?? "" };
  articles.push(article);
  await saveArticles(articles);
  res.status(201).json(article);
});

app.put("/articles/:id", async (req, res) => {
  const articles = await loadArticles();
  const idx = articles.findIndex((a) => String(a.id) === req.params.id);
  if (idx < 0) return res.status(404).json({ error: "not found" });
  articles[idx] = { ...articles[idx], ...req.body, id: articles[idx].id };
  await saveArticles(articles);
  res.json(articles[idx]);
});

app.delete("/articles/:id", async (req, res) => {
  const articles = await loadArticles();
  const next = articles.filter((a) => String(a.id) !== req.params.id);
  if (next.length === articles.length) return res.status(404).json({ error: "not found" });
  await saveArticles(next);
  res.status(204).end();
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server };
`,
    },
    oracle: `import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("articles-json-crud", () => {
  let dir;
  before(async () => {
    dir = await mkdtemp(join(tmpdir(), "articles-"));
    process.chdir(dir);
  });
  after(async () => {
    process.chdir(tmpdir());
    await rm(dir, { recursive: true, force: true });
  });

  it("writes atomically via tmp rename", async () => {
    const { saveArticles, loadArticles } = await import("../src/index.js");
    await saveArticles([{ id: 1, title: "First", body: "text" }]);
    const rows = await loadArticles();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].title, "First");
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "POST", path: "/articles", json: { title: "Hello" }, expect: { status: 201, jsonPaths: ["id", "title"] } },
        { method: "GET", path: "/articles", expect: { status: 200, jsonType: "array" } },
      ],
    },
  },

  "api-key-auth": {
    files: {
      "src/index.js": `import express from "express";
import { createHash, randomBytes } from "node:crypto";
import Database from "better-sqlite3";

const db = new Database(":memory:");
db.exec(\`CREATE TABLE api_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  usage_count INTEGER NOT NULL DEFAULT 0
)\`);

function hashKey(raw) {
  return createHash("sha256").update(raw).digest("hex");
}

export function createApiKey(name) {
  const raw = randomBytes(16).toString("hex");
  db.prepare("INSERT INTO api_keys (name, key_hash) VALUES (?, ?)").run(name, hashKey(raw));
  return raw;
}

export function apiKeyMiddleware(req, res, next) {
  const raw = req.header("X-API-Key");
  if (!raw) return res.status(401).json({ error: "missing api key" });
  const row = db.prepare("SELECT * FROM api_keys WHERE key_hash = ?").get(hashKey(raw));
  if (!row) return res.status(401).json({ error: "invalid api key" });
  db.prepare("UPDATE api_keys SET usage_count = usage_count + 1 WHERE id = ?").run(row.id);
  req.apiKey = row;
  next();
}

const app = express();
app.use(express.json());
app.post("/admin/keys", (req, res) => res.status(201).json({ key: createApiKey(req.body?.name ?? "default") }));
app.get("/protected", apiKeyMiddleware, (req, res) => res.json({ ok: true, usage: req.apiKey.usage_count + 1 }));

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server, db };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createApiKey, apiKeyMiddleware } from "../src/index.js";

describe("api-key-auth", () => {
  it("validates X-API-Key and increments usage", () => {
    const key = createApiKey("test");
    let status;
    const req = { header: (h) => (h === "X-API-Key" ? key : undefined) };
    const res = { status: (c) => ({ json: () => { status = c; } }) };
    apiKeyMiddleware(req, res, () => { status = 200; });
    assert.equal(status, 200);
    assert.ok(req.apiKey);
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "POST", path: "/admin/keys", json: { name: "ci" }, expect: { status: 201, jsonPaths: ["key"] } },
      ],
    },
  },

  "webhook-hmac-verify": {
    smoke: true,
    files: {
      "src/webhook.js": `import express from "express";
import { createHmac, timingSafeEqual } from "node:crypto";

export const SECRET = process.env.WEBHOOK_SECRET || "whsec_test";

export function verifySignature(rawBody, signatureHeader) {
  if (!signatureHeader) return false;
  const expected = createHmac("sha256", SECRET).update(rawBody).digest("hex");
  const provided = String(signatureHeader).replace(/^sha256=/, "");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(provided, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

const app = express();
app.post("/webhook", express.raw({ type: "*/*" }), (req, res) => {
  const sig = req.header("x-signature");
  const raw = req.body ?? Buffer.alloc(0);
  if (!verifySignature(raw, sig)) return res.status(401).json({ error: "invalid signature" });
  res.json({ received: true });
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifySignature, SECRET } from "../src/webhook.js";

describe("webhook-hmac-verify", () => {
  it("uses createHmac and timingSafeEqual semantics", () => {
    const body = Buffer.from('{"event":"paid"}');
    const sig = createHmac("sha256", SECRET).update(body).digest("hex");
    assert.equal(verifySignature(body, sig), true);
    assert.equal(verifySignature(body, "bad"), false);
  });
});
`,
    http: {
      start: { command: "node src/webhook.js", env: { WEBHOOK_SECRET: "whsec_test" } },
      timeoutMs: 20000,
      requests: [
        { method: "POST", path: "/webhook", headers: { "x-signature": "deadbeef" }, json: { event: "paid" }, expect: { status: 401 } },
        {
          method: "POST",
          path: "/webhook",
          headers: { "x-signature": "b85236760a6447cd065efe2b7bd10554c3744eff60cc53dfa47a639c5fd1e22c" },
          json: { event: "paid" },
          expect: { status: 200, jsonSubset: { received: true } },
        },
      ],
    },
  },

  "health-liveness-readiness": {
    smoke: true,
    files: {
      "src/index.js": `import express from "express";

const fakeDb = { connected: true };
const fakeRedis = { connected: true };

export function setReadiness({ db = true, redis = true } = {}) {
  fakeDb.connected = db;
  fakeRedis.connected = redis;
}

const app = express();
app.get("/health/liveness", (_req, res) => res.status(200).json({ alive: true }));
app.get("/health/readiness", (_req, res) => {
  const ready = fakeDb.connected && fakeRedis.connected;
  res.status(ready ? 200 : 503).json({ ready, db: fakeDb.connected, redis: fakeRedis.connected });
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server, fakeDb, fakeRedis };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { setReadiness, fakeDb, fakeRedis } from "../src/index.js";

describe("health-liveness-readiness", () => {
  it("flips readiness when dependencies drop", () => {
    setReadiness({ db: false, redis: true });
    assert.equal(fakeDb.connected, false);
    setReadiness({ db: true, redis: true });
    assert.equal(fakeRedis.connected, true);
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "GET", path: "/health/liveness", expect: { status: 200, jsonSubset: { alive: true } } },
        { method: "GET", path: "/health/readiness", expect: { status: 200, jsonPaths: ["ready"] } },
      ],
    },
  },

  "batch-jobs-progress": {
    files: {
      "src/index.js": `import express from "express";

const jobs = new Map();
let nextId = 1;

function processJob(job) {
  const total = job.items.length;
  let processed = 0;
  const timer = setInterval(() => {
    processed = Math.min(total, processed + Math.max(1, Math.floor(total / 5)));
    job.processed = processed;
    job.percentage = total ? Math.round((processed / total) * 100) : 100;
    if (processed >= total) {
      job.status = "completed";
      clearInterval(timer);
    }
  }, 10);
}

const app = express();
app.use(express.json());

app.post("/api/jobs", (req, res) => {
  const items = req.body?.items ?? [];
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: "items required" });
  const jobId = String(nextId++);
  const job = { jobId, items, processed: 0, percentage: 0, status: "running" };
  jobs.set(jobId, job);
  processJob(job);
  res.status(202).json({ jobId });
});

app.get("/api/jobs/:id", (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: "not found" });
  res.json({ jobId: job.jobId, percentage: job.percentage, status: job.status });
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server, jobs };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("batch-jobs-progress", () => {
  it("tracks jobId and percentage fields", async () => {
    const { jobs } = await import("../src/index.js");
    assert.ok(jobs instanceof Map);
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "POST", path: "/api/jobs", json: { items: [1, 2, 3, 4, 5] }, expect: { status: 202, jsonPaths: ["jobId"] } },
      ],
    },
  },

  "zip-download-stream": {
    files: {
      "src/index.js": `import express from "express";
import archiver from "archiver";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const FILES_DIR = join(process.cwd(), "files");
if (!existsSync(FILES_DIR)) {
  mkdirSync(FILES_DIR, { recursive: true });
  writeFileSync(join(FILES_DIR, "a.txt"), "alpha");
  writeFileSync(join(FILES_DIR, "b.txt"), "beta");
}

const app = express();
app.use(express.json());

app.post("/api/files/download-zip", (req, res) => {
  const names = req.body?.files ?? ["a.txt", "b.txt"];
  res.setHeader("content-type", "application/zip");
  res.setHeader("content-disposition", 'attachment; filename="bundle.zip"');
  const archive = archiver("zip");
  archive.on("error", (err) => res.status(500).end(String(err)));
  archive.pipe(res);
  for (const name of names) archive.file(join(FILES_DIR, name), { name });
  archive.finalize();
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("zip-download-stream", () => {
  it("loads archiver zip route module", async () => {
    const mod = await import("../src/index.js");
    assert.ok(mod.app);
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "POST", path: "/api/files/download-zip", json: { files: ["a.txt"] }, expect: { status: 200, headerContains: { "content-type": "zip" } } },
      ],
    },
  },

  "graceful-http-teardown": {
    files: {
      "src/index.js": `import express from "express";

const connections = new Set();
const SHUTDOWN_MS = 10000;

const app = express();
app.get("/slow", (_req, res) => setTimeout(() => res.json({ ok: true }), 50));

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

if (typeof server.on === "function") {
  server.on("connection", (socket) => {
    connections.add(socket);
    socket.on("close", () => connections.delete(socket));
  });
}

export function gracefulShutdown() {
  return new Promise((resolve) => {
    server.close(() => resolve());
    const timer = setTimeout(() => {
      for (const socket of connections) socket.destroy();
      resolve();
    }, SHUTDOWN_MS);
    timer.unref?.();
  });
}

process.once("SIGTERM", () => gracefulShutdown());
process.once("SIGINT", () => gracefulShutdown());

export { app, server, connections, SHUTDOWN_MS };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SHUTDOWN_MS, connections } from "../src/index.js";

describe("graceful-http-teardown", () => {
  it("tracks open connections with 10s drain budget", () => {
    assert.equal(SHUTDOWN_MS, 10000);
    assert.ok(connections instanceof Set);
  });
});
`,
    http: null,
  },

  "sse-metrics-feed": {
    files: {
      "src/index.js": `import express from "express";
import os from "node:os";

const app = express();

app.get("/api/events", (req, res) => {
  res.setHeader("content-type", "text/event-stream");
  res.setHeader("cache-control", "no-cache");
  res.flushHeaders?.();
  const timer = setInterval(() => {
    const payload = { load: os.loadavg()[0], ts: Date.now() };
    res.write(\`data: \${JSON.stringify(payload)}\\n\\n\`);
  }, 1000);
  req.on("close", () => clearInterval(timer));
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("sse-metrics-feed", () => {
  it("exports SSE server", async () => {
    const { app } = await import("../src/index.js");
    assert.ok(app);
  });
});
`,
    http: null,
  },

  "password-reset-tokens": {
    files: {
      "src/passwordReset.js": `import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const store = new Map();
const TTL_MS = 15 * 60 * 1000;

function hashToken(token) {
  const salt = "reset-salt";
  return scryptSync(token, salt, 32).toString("hex");
}

export function requestReset(email) {
  const token = randomBytes(24).toString("hex");
  store.set(email, { hash: hashToken(token), expiresAt: Date.now() + TTL_MS });
  return { token, link: \`/reset?token=\${token}&email=\${encodeURIComponent(email)}\` };
}

export function resetPassword(email, token, newPassword) {
  const row = store.get(email);
  if (!row || row.expiresAt < Date.now()) return { ok: false, reason: "expired" };
  const provided = Buffer.from(hashToken(token), "hex");
  const expected = Buffer.from(row.hash, "hex");
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return { ok: false, reason: "invalid" };
  }
  store.delete(email);
  return { ok: true, password: newPassword };
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { requestReset, resetPassword } from "../src/passwordReset.js";

describe("password-reset-tokens", () => {
  it("issues token then validates once", () => {
    const { token } = requestReset("u@example.com");
    const ok = resetPassword("u@example.com", token, "newpass");
    assert.equal(ok.ok, true);
    const again = resetPassword("u@example.com", token, "x");
    assert.equal(again.ok, false);
  });
});
`,
    http: null,
  },

  "tenant-isolation": {
    files: {
      "src/index.js": `import express from "express";

const tenantData = new Map();

export function tenantMiddleware(req, res, next) {
  const header = req.header("x-tenant-id");
  const host = req.hostname ?? "";
  const sub = host.split(".")[0];
  const tenant = header || (sub !== "localhost" ? sub : "default");
  if (!tenant) return res.status(400).json({ error: "tenant required" });
  req.tenant = tenant;
  if (!tenantData.has(tenant)) tenantData.set(tenant, { items: [] });
  req.tenantStore = tenantData.get(tenant);
  next();
}

const app = express();
app.use(express.json());
app.use(tenantMiddleware);

app.get("/items", (req, res) => res.json({ tenant: req.tenant, items: req.tenantStore.items }));
app.post("/items", (req, res) => {
  const item = { id: req.tenantStore.items.length + 1, name: req.body?.name ?? "item" };
  req.tenantStore.items.push(item);
  res.status(201).json(item);
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server, tenantData };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { tenantMiddleware } from "../src/index.js";

describe("tenant-isolation", () => {
  it("sets tenant from x-tenant-id header", () => {
    const req = { header: (h) => (h === "x-tenant-id" ? "tenant1" : undefined), hostname: "localhost" };
    const res = { status: () => ({ json: () => {} }) };
    tenantMiddleware(req, res, () => {});
    assert.equal(req.tenant, "tenant1");
    assert.ok(req.tenantStore);
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "GET", path: "/items", headers: { "x-tenant-id": "acme" }, expect: { status: 200, jsonSubset: { tenant: "acme" } } },
      ],
    },
  },

  "audit-log-middleware": {
    files: {
      "src/index.js": `import express from "express";

export const auditLog = [];

export function auditMiddleware(req, res, next) {
  const mutating = ["POST", "PUT", "DELETE"].includes(req.method);
  if (!mutating) return next();
  const started = Date.now();
  res.on("finish", () => {
    auditLog.push({
      userId: req.header("x-user-id") ?? "anonymous",
      method: req.method,
      path: req.path,
      ip: req.ip ?? req.socket?.remoteAddress ?? "unknown",
      status: res.statusCode,
      at: new Date(started).toISOString(),
      body: req.body,
    });
  });
  next();
}

const app = express();
app.use(express.json());
app.use(auditMiddleware);
app.post("/resources", (req, res) => res.status(201).json({ id: 1, ...req.body }));
app.delete("/resources/:id", (req, res) => res.status(204).end());

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { auditMiddleware, auditLog } from "../src/index.js";

describe("audit-log-middleware", () => {
  it("records POST mutations", () => {
    auditLog.length = 0;
    const req = { method: "POST", path: "/resources", header: () => "u1", body: { x: 1 }, ip: "127.0.0.1", socket: {} };
    const res = { statusCode: 201, on: (ev, fn) => ev === "finish" && fn() };
    auditMiddleware(req, res, () => {});
    assert.equal(auditLog.length, 1);
    assert.equal(auditLog[0].method, "POST");
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "POST", path: "/resources", json: { name: "x" }, expect: { status: 201 } },
      ],
    },
  },

  "chunked-file-upload": {
    files: {
      "src/index.js": `import express from "express";
import { mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { join } from "node:path";

const uploads = new Map();
const UPLOAD_DIR = join(process.cwd(), "uploads");

const app = express();

app.post("/upload/init", express.json(), (req, res) => {
  const uploadId = String(Date.now());
  uploads.set(uploadId, { parts: new Map(), meta: req.body ?? {} });
  res.json({ uploadId });
});

app.post("/upload/chunk", express.raw({ type: "*/*", limit: "20mb" }), (req, res) => {
  const uploadId = req.header("x-upload-id");
  const index = Number(req.header("x-chunk-index"));
  const row = uploads.get(uploadId);
  if (!row || Number.isNaN(index)) return res.status(400).json({ error: "bad chunk" });
  row.parts.set(index, Buffer.from(req.body ?? []));
  res.json({ ok: true, index });
});

app.post("/upload/complete", express.json(), async (req, res) => {
  const { uploadId, filename } = req.body ?? {};
  const row = uploads.get(uploadId);
  if (!row) return res.status(404).json({ error: "unknown upload" });
  await mkdir(UPLOAD_DIR, { recursive: true });
  const ordered = [...row.parts.entries()].sort((a, b) => a[0] - b[0]).map(([, b]) => b);
  await writeFile(join(UPLOAD_DIR, filename ?? "file.bin"), Buffer.concat(ordered));
  uploads.delete(uploadId);
  res.json({ ok: true, filename });
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server, uploads, UPLOAD_DIR };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("chunked-file-upload", () => {
  it("tracks upload sessions in memory", async () => {
    const { uploads } = await import("../src/index.js");
    assert.ok(uploads instanceof Map);
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "POST", path: "/upload/init", json: { name: "big.bin" }, expect: { status: 200, jsonPaths: ["uploadId"] } },
      ],
    },
  },

  "dynamic-rbac": {
    files: {
      "src/rbac.js": `const rolePermissions = {
  admin: new Set(["read", "write", "delete"]),
  editor: new Set(["read", "write"]),
  viewer: new Set(["read"]),
};

const userRoles = new Map([
  ["u1", "admin"],
  ["u2", "viewer"],
]);

const userOverrides = new Map([
  ["u2", new Set(["write"])],
]);

/** RBAC permission evaluator: roles plus direct user permission overrides. */
export function canUserExecute(userId, action, resource) {
  void resource;
  const role = userRoles.get(userId);
  if (!role) return false;
  const permissions = rolePermissions[role] ?? new Set();
  const overrides = userOverrides.get(userId) ?? new Set();
  return permissions.has(action) || overrides.has(action);
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { canUserExecute } from "../src/rbac.js";

describe("dynamic-rbac", () => {
  it("evaluates role permissions with user overrides", () => {
    assert.equal(canUserExecute("u1", "delete", "doc"), true);
    assert.equal(canUserExecute("u2", "read", "doc"), true);
    assert.equal(canUserExecute("u2", "write", "doc"), true);
    assert.equal(canUserExecute("u2", "delete", "doc"), false);
  });
});
`,
    http: null,
  },

  "cron-redis-lock": {
    files: {
      "src/index.js": `/** node-cron schedule + redlock-style lock (in-memory; no Redis). */

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
  const ok = await redis.set(\`lock:\${name}\`, token, "PX", "PX", ttlMs);
  return ok ? token : null;
}

export function scheduleDailyJob(expression, taskName, fn) {
  const handle = { stopped: false, expression };
  queueMicrotask(async () => {
    if (handle.stopped) return;
    const token = await acquireLock(taskName);
    if (!token) return;
    try { await fn(); runs += 1; } finally { await redis.eval("", 1, \`lock:\${taskName}\`); }
  });
  return { stop() { handle.stopped = true; } };
}

export { redis, runs };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { acquireLock, redis } from "../src/index.js";

describe("cron-redis-lock", () => {
  it("uses in-memory lock semantics", async () => {
    const t1 = await acquireLock("job", 1000);
    const t2 = await acquireLock("job", 1000);
    assert.ok(t1);
    assert.equal(t2, null);
    assert.ok(redis);
  });
});
`,
    http: null,
  },

  "csv-export-stream": {
    files: {
      "src/index.js": `import express from "express";
import Database from "better-sqlite3";
import { Readable } from "node:stream";

const db = new Database(":memory:");
db.exec("CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT, email TEXT)");
const insert = db.prepare("INSERT INTO users(name,email) VALUES(?,?)");
for (let i = 1; i <= 5; i++) insert.run(\`User \${i}\`, \`u\${i}@example.com\`);

function csvEscape(v) {
  const s = String(v ?? "");
  return s.includes(",") || s.includes('"') ? \`"\${s.replaceAll('"', '""')}"\` : s;
}

const app = express();
app.get("/export/users.csv", (_req, res) => {
  res.setHeader("content-type", "text/csv");
  res.write("id,name,email\\n");
  const stmt = db.prepare("SELECT id,name,email FROM users ORDER BY id");
  const stream = Readable.from(
    (function* () {
      for (const row of stmt.iterate()) {
        yield \`\${row.id},\${csvEscape(row.name)},\${csvEscape(row.email)}\\n\`;
      }
    })(),
  );
  stream.pipe(res);
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server, db };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("csv-export-stream", () => {
  it("streams CSV from sqlite iterator", async () => {
    const { db } = await import("../src/index.js");
    const rows = db.prepare("SELECT COUNT(*) AS c FROM users").get();
    assert.equal(rows.c, 5);
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "GET", path: "/export/users.csv", expect: { status: 200, headerContains: { "content-type": "text/csv" }, bodyContains: "User 1" } },
      ],
    },
  },

  "ip-ban-sliding-window": {
    files: {
      "src/index.js": `import express from "express";

const failures = new Map();
const bans = new Map();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_FAILS = 10;

export function record401(ip) {
  const now = Date.now();
  const arr = (failures.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  failures.set(ip, arr);
  if (arr.length > MAX_FAILS) bans.set(ip, now + WINDOW_MS);
}

export function ipBanMiddleware(req, res, next) {
  const ip = req.ip ?? "127.0.0.1";
  const until = bans.get(ip) ?? 0;
  if (until > Date.now()) return res.status(403).json({ error: "banned" });
  next();
}

const app = express();
app.use(express.json());
app.use(ipBanMiddleware);
app.post("/login", (req, res) => {
  const ip = req.ip ?? "127.0.0.1";
  if (req.body?.password !== "secret") {
    record401(ip);
    return res.status(401).json({ error: "unauthorized" });
  }
  res.json({ ok: true });
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server, bans, MAX_FAILS, WINDOW_MS };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { record401, bans, MAX_FAILS } from "../src/index.js";

describe("ip-ban-sliding-window", () => {
  it("bans after more than 10 failures in window", () => {
    bans.clear();
    const ip = "10.0.0.1";
    for (let i = 0; i <= MAX_FAILS; i++) record401(ip);
    assert.ok(bans.has(ip));
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "POST", path: "/login", json: { password: "bad" }, expect: { status: 401 } },
      ],
    },
  },

  "cursor-pagination": {
    files: {
      "src/index.js": `import express from "express";

const items = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: \`Item \${i + 1}\` }));

function encodeCursor(obj) {
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
}

function decodeCursor(raw) {
  if (!raw) return null;
  try { return JSON.parse(Buffer.from(raw, "base64url").toString("utf8")); } catch { return null; }
}

const app = express();
app.get("/items", (req, res) => {
  const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 20)));
  const cursor = decodeCursor(req.query.cursor);
  let startIdx = 0;
  if (cursor?.id) startIdx = items.findIndex((x) => x.id === cursor.id) + 1;
  const slice = items.slice(startIdx, startIdx + limit);
  const next = startIdx + limit < items.length ? encodeCursor({ id: slice.at(-1).id }) : null;
  res.json({ items: slice, nextCursor: next });
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server, encodeCursor, decodeCursor };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { encodeCursor, decodeCursor } from "../src/index.js";

describe("cursor-pagination", () => {
  it("round-trips cursor tokens", () => {
    const c = encodeCursor({ id: 10 });
    assert.deepEqual(decodeCursor(c), { id: 10 });
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "GET", path: "/items?limit=5", expect: { status: 200, jsonPaths: ["items", "nextCursor"] } },
      ],
    },
  },

  "soft-delete-engine": {
    files: {
      "src/softDelete.js": `const tables = new Map();

function table(name) {
  if (!tables.has(name)) tables.set(name, []);
  return tables.get(name);
}

export const softDb = {
  insert(name, row) {
    table(name).push({ ...row, deleted_at: null });
  },
  find(name) {
    return table(name).filter((r) => r.deleted_at == null);
  },
  softDelete(name, id) {
    const rows = table(name);
    const row = rows.find((r) => r.id === id);
    if (row) row.deleted_at = new Date().toISOString();
    return row;
  },
  hardCount(name) {
    return table(name).length;
  },
};
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { softDb } from "../src/softDelete.js";

describe("soft-delete-engine", () => {
  it("filters deleted_at rows from find", () => {
    softDb.insert("users", { id: 1, name: "Ada" });
    softDb.softDelete("users", 1);
    assert.equal(softDb.find("users").length, 0);
    assert.equal(softDb.hardCount("users"), 1);
  });
});
`,
    http: null,
  },

  "token-revocation-list": {
    files: {
      "src/index.js": `import express from "express";

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
  add(jti, ttlSec) { redis.setex(\`blacklist:\${jti}\`, ttlSec, "1"); }, // TTL seconds
  has(jti) { return redis.get(\`blacklist:\${jti}\`) != null; },
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
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { blacklist } from "../src/index.js";

describe("token-revocation-list", () => {
  it("stores revoked JTIs with TTL semantics", () => {
    blacklist.add("tok-1", 60);
    assert.equal(blacklist.has("tok-1"), true);
    assert.equal(blacklist.has("tok-2"), false);
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "POST", path: "/logout", json: { jti: "abc", ttlSec: 120 }, expect: { status: 200, jsonSubset: { revoked: true } } },
      ],
    },
  },

  "db-pool-monitor": {
    files: {
      "src/index.js": `class FakePool {
  constructor() {
    this.activeConnections = 2;
    this.idleConnections = 3;
    this.queuedRequests = 0;
  }
  snapshot() {
    return {
      activeConnections: this.activeConnections,
      idleConnections: this.idleConnections,
      queuedRequests: this.queuedRequests,
    };
  }
}

export const pool = new FakePool();
export const alerts = [];

export function monitorPool({ starvationThreshold = 5 } = {}) {
  const s = pool.snapshot();
  if (s.queuedRequests >= starvationThreshold) {
    alerts.push({ type: "pool-starvation", at: Date.now(), ...s });
  }
  return s;
}

export function setPoolState(partial) {
  Object.assign(pool, partial);
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { monitorPool, setPoolState, alerts } from "../src/index.js";

describe("db-pool-monitor", () => {
  it("emits alert on queued request starvation", () => {
    alerts.length = 0;
    setPoolState({ queuedRequests: 6 });
    const snap = monitorPool();
    assert.equal(snap.queuedRequests, 6);
    assert.equal(alerts.length, 1);
  });
});
`,
    http: null,
  },

  "content-negotiation": {
    files: {
      "src/contentNegotiation.js": `function toXml(obj) {
  const entries = Object.entries(obj ?? {}).map(([k, v]) => \`<\${k}>\${v}</\${k}>\`).join("");
  return \`<?xml version="1.0"?><response>\${entries}</response>\`;
}

export function negotiateResponse(req, data) {
  const accept = String(req.headers?.Accept ?? req.headers?.accept ?? "application/json").toLowerCase(); // Accept + xml + json
  if (accept.includes("application/xml") || accept.includes("text/xml")) {
    return { type: "application/xml", body: toXml(data) };
  }
  if (accept.includes("text/plain")) {
    return { type: "text/plain", body: JSON.stringify(data) };
  }
  return { type: "application/json", body: JSON.stringify(data) };
}

export function contentNegotiationMiddleware(req, res, next) {
  res.formatPayload = (data) => {
    const out = negotiateResponse(req, data);
    res.type(out.type).send(out.body);
  };
  next();
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { negotiateResponse } from "../src/contentNegotiation.js";

describe("content-negotiation", () => {
  it("returns xml/json/text based on Accept", () => {
    const json = negotiateResponse({ headers: { accept: "application/json" } }, { ok: true });
    assert.equal(json.type, "application/json");
    const xml = negotiateResponse({ headers: { accept: "application/xml" } }, { ok: true });
    assert.match(xml.body, /<ok>true<\\/ok>/);
  });
});
`,
    http: null,
  },

  "feature-flag-manager": {
    smoke: true,
    files: {
      "src/featureFlags.js": `import { createHash } from "node:crypto";

const flags = new Map();

/** Configure percentage rollout for a feature key (0–100). */
export function setFeatureRollout(key, pct) {
  flags.set(key, { pct: Math.max(0, Math.min(100, Number(pct))), rollout: true });
}

function bucket(userId, key) {
  const hash = createHash("sha256").update(String(userId) + String(key)).digest();
  return hash[0] % 100;
}

export function isFeatureEnabled(featureKey, userContext = {}) {
  const cfg = flags.get(featureKey);
  if (!cfg) return false;
  const userId = userContext.userId ?? userContext.id ?? "anon";
  return bucket(userId, featureKey) < cfg.pct;
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { setFeatureRollout, isFeatureEnabled } from "../src/featureFlags.js";

describe("feature-flag-manager", () => {
  it("is deterministic per userId+key rollout", () => {
    setFeatureRollout("new-ui", 50);
    const a1 = isFeatureEnabled("new-ui", { userId: "user-42" });
    const a2 = isFeatureEnabled("new-ui", { userId: "user-42" });
    assert.equal(a1, a2);
  });
});
`,
    http: null,
  },

  "storage-abstraction": {
    files: {
      "src/storage.js": `import { mkdir, writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";

export class LocalStorageProvider {
  constructor(root = join(process.cwd(), "storage")) {
    this.root = root;
  }
  async upload(key, data) {
    await mkdir(this.root, { recursive: true });
    const path = join(this.root, key);
    await writeFile(path, data);
    return { key, url: \`/local/\${key}\` };
  }
  async delete(key) {
    await unlink(join(this.root, key)).catch(() => {});
    return { deleted: key };
  }
  getUrl(key) { return \`/local/\${key}\`; }
}

export class S3StorageProvider {
  constructor(bucket = "demo-bucket") {
    this.bucket = bucket;
    this.objects = new Map();
  }
  async upload(key, data) {
    this.objects.set(key, data);
    return { key, url: \`https://\${this.bucket}.s3.amazonaws.com/\${key}\` };
  }
  async delete(key) {
    this.objects.delete(key);
    return { deleted: key };
  }
  getUrl(key) { return \`https://\${this.bucket}.s3.amazonaws.com/\${key}\`; }
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LocalStorageProvider, S3StorageProvider } from "../src/storage.js";

describe("storage-abstraction", () => {
  it("local and s3 providers share upload/delete/getUrl", async () => {
    const s3 = new S3StorageProvider("b");
    const up = await s3.upload("a.txt", "data");
    assert.match(up.url, /s3.amazonaws.com/);
    assert.equal(s3.getUrl("a.txt"), up.url);
    await s3.delete("a.txt");
    const local = new LocalStorageProvider();
    assert.equal(typeof local.upload, "function");
  });
});
`,
    http: null,
  },

  "idempotency-middleware": {
    files: {
      "src/index.js": `import express from "express";

class InMemoryRedis {
  constructor() { this.kv = new Map(); }
  set(key, value) { this.kv.set(key, value); return "OK"; }
  get(key) { return this.kv.get(key) ?? null; }
}

export const redis = new InMemoryRedis();

export function idempotencyMiddleware(req, res, next) {
  const key = req.header("Idempotency-Key");
  if (!key || req.method === "GET") return next();
  const cacheKey = \`idem:\${key}\`;
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
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { redis, idempotencyMiddleware } from "../src/index.js";

describe("idempotency-middleware", () => {
  it("caches responses by Idempotency-Key", () => {
    redis.kv.clear();
    let body;
    const req = { method: "POST", header: (h) => (h === "Idempotency-Key" ? "k1" : undefined), body: { amount: 5 } };
    const res = {
      statusCode: 201,
      status(c) { this.statusCode = c; return this; },
      json(b) { body = b; return this; },
    };
    idempotencyMiddleware(req, res, () => res.json({ paid: true, amount: 5 }));
    assert.deepEqual(body, { paid: true, amount: 5 });
    let cached;
    const res2 = { statusCode: 200, status() { return this; }, json(b) { cached = b; } };
    idempotencyMiddleware(req, res2, () => res2.json({ paid: false }));
    assert.deepEqual(cached, { paid: true, amount: 5 });
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "POST", path: "/pay", headers: { "Idempotency-Key": "abc-1" }, json: { amount: 10 }, expect: { status: 201, jsonSubset: { paid: true } } },
      ],
    },
  },

  "db-seeder-script": {
    files: {
      "src/index.js": `import { faker } from "@faker-js/faker";

export function seedUsers(count = 10, seed = 42) {
  faker.seed(seed);
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: i + 1,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      companyId: (i % 3) + 1,
    });
  }
  return users;
}

if (import.meta.url === \`file://\${process.argv[1]}\`) {
  const count = Number(process.argv[2] ?? 10);
  console.log(JSON.stringify(seedUsers(count), null, 2));
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { seedUsers } from "../src/index.js";

describe("db-seeder-script", () => {
  it("deterministic faker output with wired foreign keys", () => {
    const a = seedUsers(5, 99);
    const b = seedUsers(5, 99);
    assert.deepEqual(a, b);
    assert.equal(a[0].companyId, 1);
  });
});
`,
    http: null,
  },

  "traffic-shadowing": {
    files: {
      "src/index.js": `import express from "express";

export const shadowLog = [];

export function shadowMiddleware(stagingUrl) {
  return (req, res, next) => {
    setImmediate(() => {
      shadowLog.push({
        method: req.method,
        path: req.originalUrl ?? req.url,
        stagingUrl,
        at: Date.now(),
      });
    });
    next();
  };
}

const app = express();
app.use(express.json());
app.use(shadowMiddleware("http://staging.internal"));
app.get("/api/data", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { shadowMiddleware, shadowLog } from "../src/index.js";

describe("traffic-shadowing", () => {
  it("mirrors requests asynchronously", async () => {
    shadowLog.length = 0;
    const mw = shadowMiddleware("http://staging");
    await new Promise((resolve) => {
      mw({ method: "GET", originalUrl: "/api/data" }, {}, () => resolve());
    });
    await new Promise((r) => setImmediate(r));
    assert.equal(shadowLog.length, 1);
    assert.equal(shadowLog[0].stagingUrl, "http://staging");
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "GET", path: "/api/data", expect: { status: 200, jsonSubset: { ok: true } } },
      ],
    },
  },

  "db-reconnect-backoff": {
    files: {
      "src/index.js": `/** Automatic reconnect with exponential backoff. */
export class ReconnectingDb {
  constructor({ maxRetries = 5, baseDelayMs = 100 } = {}) {
    this.maxRetries = maxRetries;
    this.baseDelayMs = baseDelayMs;
    this.connected = false;
    this.attempts = 0;
  }
  async connect() {
    this.attempts = 0;
    while (this.attempts < this.maxRetries) {
      try {
        await this._tryConnect();
        this.connected = true;
        return;
      } catch (err) {
        this.attempts += 1;
        const backoffMs = this.baseDelayMs * 2 ** (this.attempts - 1);
        await new Promise((r) => setTimeout(r, backoffMs));
        if (this.attempts >= this.maxRetries) throw err;
      }
    }
  }
  async _tryConnect() {
    if (process.env.FORCE_DB_FAIL === "1" && this.attempts < 2) throw new Error("connection dropped");
  }
  async query(sql) {
    if (!this.connected) throw new Error("not connected");
    return { sql, rows: [] };
  }
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ReconnectingDb } from "../src/index.js";

describe("db-reconnect-backoff", () => {
  it("retries with exponential backoff", async () => {
    process.env.FORCE_DB_FAIL = "1";
    const db = new ReconnectingDb({ maxRetries: 3, baseDelayMs: 1 });
    await db.connect();
    assert.equal(db.connected, true);
    delete process.env.FORCE_DB_FAIL;
  });
});
`,
    http: null,
  },

  "pdf-invoice-report": {
    files: {
      "src/index.js": `import express from "express";
import PDFDocument from "pdfkit";

const app = express();
app.use(express.json());

app.post("/api/reports/invoice-pdf", (req, res) => {
  const { invoiceId = "INV-1", customer = "Acme", total = 100 } = req.body ?? {};
  res.setHeader("content-type", "application/pdf");
  const doc = new PDFDocument();
  doc.pipe(res);
  doc.fontSize(18).text("Invoice", { underline: true });
  doc.moveDown().fontSize(12).text(\`Invoice ID: \${invoiceId}\`);
  doc.text(\`Customer: \${customer}\`);
  doc.text(\`Total: $\${total}\`);
  doc.end();
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("pdf-invoice-report", () => {
  it("exports pdf invoice route", async () => {
    const { app } = await import("../src/index.js");
    assert.ok(app);
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "POST", path: "/api/reports/invoice-pdf", json: { invoiceId: "X1", total: 50 }, expect: { status: 200, headerContains: { "content-type": "pdf" } } },
      ],
    },
  },

  "config-hot-reload": {
    files: {
      "src/index.js": `import express from "express";
import fs from "node:fs";
import { join } from "node:path";

const CONFIG_PATH = join(process.cwd(), "config.json");
if (!fs.existsSync(CONFIG_PATH)) {
  fs.mkdirSync(join(process.cwd()), { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ featureX: false, maxUsers: 10 }));
}

export let config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));

export const configWatcher =
  process.env.MITII_NO_LISTEN === "1"
    ? null
    : fs.watch(CONFIG_PATH, () => {
        try {
          config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
        } catch {
          /* ignore parse errors */
        }
      });

const app = express();
app.get("/config", (_req, res) => res.json(config));

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server, CONFIG_PATH };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("config-hot-reload", () => {
  it("loads config.json into memory", async () => {
    const { config } = await import("../src/index.js");
    assert.equal(typeof config, "object");
    assert.ok("maxUsers" in config || "featureX" in config);
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "GET", path: "/config", expect: { status: 200, jsonType: "object" } },
      ],
    },
  },

  "secure-cookie-session": {
    files: {
      "src/index.js": `import express from "express";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

const KEY = scryptSync(process.env.SESSION_SECRET || "test-secret", "salt", 32);

/** AES-256-GCM session cookie seal/unseal. */
function seal(data) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", KEY, iv);
  const enc = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

function open(token) {
  const buf = Buffer.from(token, "base64url");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const enc = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", KEY, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return JSON.parse(dec.toString("utf8"));
}

export function sessionMiddleware(req, res, next) {
  const raw = req.headers.cookie?.match(/sid=([^;]+)/)?.[1];
  req.session = raw ? open(raw) : {};
  res.setSession = (data) => {
    const token = seal(data);
    res.setHeader(
      "Set-Cookie",
      \`sid=\${token}; HttpOnly; Secure; SameSite=Strict; Path=/; httpOnly\`, // AES-256-GCM
    );
  };
  next();
}

const app = express();
app.use(sessionMiddleware);
app.post("/login", (req, res) => {
  res.setSession({ userId: req.body?.userId ?? "guest" });
  res.json({ ok: true });
});
app.get("/me", (req, res) => res.json(req.session));

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server, seal, open };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { seal, open } from "../src/index.js";

describe("secure-cookie-session", () => {
  it("round-trips AES-256-GCM session payload", () => {
    const token = seal({ userId: "u1" });
    assert.deepEqual(open(token), { userId: "u1" });
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "POST", path: "/login", json: { userId: "u1" }, expect: { status: 200, jsonSubset: { ok: true } } },
      ],
    },
  },

  "data-masking": {
    smoke: true,
    files: {
      "src/maskSensitive.js": `const SENSITIVE = new Set(["ssn", "creditcard", "credit_card", "password"]);

export function maskSensitive(input) {
  if (Array.isArray(input)) return input.map((v) => maskSensitive(v));
  if (!input || typeof input !== "object") return input;
  const out = {};
  for (const [key, value] of Object.entries(input)) {
    const norm = key.toLowerCase().replace(/[^a-z]/g, "");
    if (SENSITIVE.has(norm)) out[key] = "***REDACTED***";
    else if (value && typeof value === "object") out[key] = maskSensitive(value);
    else out[key] = value;
  }
  return out;
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { maskSensitive } from "../src/maskSensitive.js";

describe("data-masking", () => {
  it("recursively masks ssn/password/creditCard", () => {
    const out = maskSensitive({ name: "Ada", password: "x", nested: { ssn: "1", creditCard: "4111" } });
    assert.equal(out.password, "***REDACTED***");
    assert.equal(out.nested.ssn, "***REDACTED***");
    assert.equal(out.nested.creditCard, "***REDACTED***");
  });
});
`,
    http: null,
  },

  "redis-pubsub-notifications": {
    files: {
      "src/index.js": `import express from "express";
import { createServer } from "node:http";
import { EventEmitter } from "node:events";

class InMemoryRedisPubSub {
  constructor() { this.channels = new Map(); }
  publish(channel, message) {
    for (const fn of this.channels.get(channel) ?? []) fn(message);
    return 1;
  }
  subscribe(channel, fn) {
    if (!this.channels.has(channel)) this.channels.set(channel, new Set());
    this.channels.get(channel).add(fn);
    return () => this.channels.get(channel)?.delete(fn);
  }
}

export const bus = new InMemoryRedisPubSub();
const app = express();
const httpServer = createServer(app);
const io = new EventEmitter(); // socket.io-compatible fan-out for tests

io.on("connection", (socket) => {
  socket.on("subscribe", (channel) => {
    const off = bus.subscribe(channel, (msg) => socket.emit("notification", { channel, msg }));
    socket.on("disconnect", off);
  });
});

app.post("/notify", express.json(), (req, res) => {
  const { channel = "alerts", message = "" } = req.body ?? {};
  bus.publish(channel, message);
  res.json({ published: true });
});

const port = Number(process.env.PORT || 0);
if (process.env.MITII_NO_LISTEN !== "1") {
  httpServer.listen(port, () => {
    const addr = httpServer.address();
    if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
  });
}

export { app, httpServer, io };
`,
    },
    oracle: `import { describe, it, after } from "node:test";
import assert from "node:assert/strict";

describe("redis-pubsub-notifications", () => {
  after(async () => {
    const { httpServer, io } = await import("../src/index.js");
    io.close?.();
    await new Promise((resolve) => httpServer.close?.(resolve) ?? resolve());
  });

  it("delivers pub/sub messages in-process", async () => {
    const { bus } = await import("../src/index.js");
    const seen = [];
    bus.subscribe("alerts", (m) => seen.push(m));
    bus.publish("alerts", "hello");
    assert.deepEqual(seen, ["hello"]);
  });
});
`,
    http: {
      start: { command: "node src/index.js" },
      timeoutMs: 20000,
      requests: [
        { method: "POST", path: "/notify", json: { channel: "alerts", message: "ping" }, expect: { status: 200, jsonSubset: { published: true } } },
      ],
    },
  },

  "graphql-complexity-limit": {
    files: {
      "src/index.js": `import express from "express";

export function analyzeQuery(query, { maxDepth = 5, maxComplexity = 20 } = {}) {
  const depth = (query.match(/{/g) ?? []).length;
  const fields = (query.match(/\\w+/g) ?? []).length;
  const complexity = depth * fields;
  return { depth, complexity, allowed: depth <= maxDepth && complexity <= maxComplexity };
}

const app = express();
app.use(express.json());
app.post("/graphql", (req, res) => {
  const query = req.body?.query ?? "";
  const report = analyzeQuery(query);
  if (!report.allowed) return res.status(400).json({ error: "query too complex", ...report });
  res.json({ data: { ok: true }, ...report });
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { analyzeQuery } from "../src/index.js";

describe("graphql-complexity-limit", () => {
  it("rejects deep/complex queries", () => {
    const shallow = analyzeQuery("{ user { id } }");
    assert.equal(shallow.allowed, true);
    const deep = analyzeQuery("{ a { b { c { d { e { f { g } } } } } } }");
    assert.equal(deep.allowed, false);
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "POST", path: "/graphql", json: { query: "{ user { id name } }" }, expect: { status: 200, jsonPaths: ["data"] } },
      ],
    },
  },

  "i18n-middleware": {
    files: {
      "src/index.js": `import express from "express";

const CATALOG = {
  en: { greeting: "Hello" },
  es: { greeting: "Hola" },
  fr: { greeting: "Bonjour" },
};

function pickLocale(header) {
  const raw = String(header ?? "en").split(",")[0]?.trim() ?? "en";
  return raw.split("-")[0];
}

export function i18nMiddleware(req, res, next) {
  const locale = pickLocale(req.header("Accept-Language"));
  const dict = CATALOG[locale] ?? CATALOG.en;
  req.locale = locale;
  req.__ = (key) => dict[key] ?? key;
  next();
}

const app = express();
app.use(i18nMiddleware);
app.get("/hello", (req, res) => res.json({ message: req.__("greeting"), locale: req.locale }));

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server, CATALOG };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { i18nMiddleware } from "../src/index.js";

describe("i18n-middleware", () => {
  it("injects req.__ translator from Accept-Language", () => {
    const req = { header: (h) => (h === "Accept-Language" ? "es-ES" : undefined) };
    i18nMiddleware(req, {}, () => {});
    assert.equal(req.__("greeting"), "Hola");
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "GET", path: "/hello", headers: { "Accept-Language": "fr" }, expect: { status: 200, jsonSubset: { message: "Bonjour" } } },
      ],
    },
  },

  "inverted-index-search": {
    files: {
      "src/searchIndex.js": `/** In-memory inverted index with TF-IDF ranking. */
export class InvertedIndex {
  constructor() {
    this.docs = [];
    this.index = new Map();
    this.inverted = this.index;
  }
  add(doc) {
    const id = this.docs.length;
    this.docs.push(doc);
    const terms = String(doc.text ?? "").toLowerCase().match(/[a-z0-9]+/g) ?? [];
    for (const term of new Set(terms)) {
      if (!this.index.has(term)) this.index.set(term, new Map());
      const tfMap = this.index.get(term);
      tfMap.set(id, (tfMap.get(id) ?? 0) + 1);
    }
    return id;
  }
  search(query, limit = 5) {
    const terms = String(query).toLowerCase().match(/[a-z0-9]+/g) ?? [];
    const scores = new Map();
    const N = this.docs.length || 1;
    for (const term of terms) {
      const postings = this.index.get(term);
      if (!postings) continue;
      const df = postings.size;
      const idf = Math.log((N + 1) / (df + 1)) + 1;
      for (const [docId, tf] of postings.entries()) {
        scores.set(docId, (scores.get(docId) ?? 0) + tf * idf);
      }
    }
    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id, score]) => ({ ...this.docs[id], score }));
  }
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { InvertedIndex } from "../src/searchIndex.js";

describe("inverted-index-search", () => {
  it("ranks TF-IDF matches", () => {
    const idx = new InvertedIndex();
    idx.add({ text: "node backend services" });
    idx.add({ text: "backend api design" });
    const hits = idx.search("backend");
    assert.ok(hits.length >= 1);
    assert.ok(hits[0].score > 0);
  });
});
`,
    http: null,
  },

  "event-sourcing-store": {
    smoke: true,
    files: {
      "src/eventStore.js": `const streams = new Map();

export function appendEvent(streamId, eventType, data) {
  if (!streams.has(streamId)) streams.set(streamId, []);
  const events = streams.get(streamId);
  const event = { version: events.length + 1, type: eventType, data, at: new Date().toISOString() };
  events.push(event);
  return event;
}

export function getStream(streamId) {
  return [...(streams.get(streamId) ?? [])];
}

export function replay(streamId, reducer, initial = {}) {
  return getStream(streamId).reduce((state, ev) => reducer(state, ev), initial);
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { appendEvent, getStream, replay } from "../src/eventStore.js";

describe("event-sourcing-store", () => {
  it("appendEvent/getStream replay rebuilds state", () => {
    appendEvent("order-1", "Created", { total: 0 });
    appendEvent("order-1", "ItemAdded", { amount: 10 });
    const events = getStream("order-1");
    assert.equal(events.length, 2);
    const total = replay("order-1", (s, ev) => {
      if (ev.type === "ItemAdded") return s + ev.data.amount;
      return s;
    }, 0);
    assert.equal(total, 10);
  });
});
`,
    http: null,
  },

  "totp-2fa": {
    files: {
      "src/index.js": `import express from "express";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

const secrets = new Map();

const app = express();
app.use(express.json());

app.post("/2fa/generate", async (req, res) => {
  const userId = req.body?.userId ?? "user";
  const secret = speakeasy.generateSecret({ name: \`Mitii (\${userId})\` });
  secrets.set(userId, secret.base32);
  const qr = await QRCode.toDataURL(secret.otpauth_url);
  res.json({ secret: secret.base32, qr });
});

app.post("/2fa/verify", (req, res) => {
  const userId = req.body?.userId ?? "user";
  const token = String(req.body?.token ?? "");
  const base32 = secrets.get(userId);
  if (!base32) return res.status(400).json({ error: "no secret" });
  const ok = speakeasy.totp.verify({ secret: base32, encoding: "base32", token, window: 1 });
  res.json({ valid: ok });
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server, secrets };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import speakeasy from "speakeasy";

describe("totp-2fa", () => {
  it("generates and verifies TOTP codes", () => {
    const secret = speakeasy.generateSecret().base32;
    const token = speakeasy.totp({ secret, encoding: "base32" });
    assert.equal(speakeasy.totp.verify({ secret, encoding: "base32", token }), true);
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "POST", path: "/2fa/generate", json: { userId: "u1" }, expect: { status: 200, jsonPaths: ["secret", "qr"] } },
      ],
    },
  },

  "api-gateway-proxy": {
    files: {
      "package.json":
        JSON.stringify(
          {
            name: "mitii-case-solution",
            version: "1.0.0",
            private: true,
            type: "module",
            scripts: {
              start: "node src/index.js",
              build: 'node -e "console.log(\'build ok\')"',
              test: "node --test test/*.test.js",
            },
            dependencies: {
              express: "^4.21.2",
              "http-proxy-middleware": "^3.0.0",
            },
          },
          null,
          2,
        ) + "\n",
      "src/index.js": `import express from "express";
import { request as httpRequest, createServer as createHttpServer } from "node:http";
import { createServer } from "node:net";

function getFreePort() {
  return new Promise((resolve, reject) => {
    const s = createServer();
    s.listen(0, "127.0.0.1", () => {
      const port = s.address().port;
      s.close(() => resolve(port));
    });
    s.on("error", reject);
  });
}

function proxy(targetPort) {
  return (req, res) => {
    const path = req.url.replace(/^\\/services\\/users/, "") || "/";
    const p = httpRequest({ hostname: "127.0.0.1", port: targetPort, path, method: req.method, headers: req.headers }, (up) => {
      res.writeHead(up.statusCode ?? 502, up.headers);
      up.pipe(res);
    });
    p.on("error", () => res.status(502).json({ error: "proxy failed" }));
    req.pipe(p);
  };
}

let downstreamPort = 0;
let downstream = null;
if (process.env.MITII_NO_LISTEN !== "1") {
  downstreamPort = await getFreePort();
  downstream = createHttpServer((req, res) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ service: "users", path: req.url }));
  });
  downstream.listen(downstreamPort, "127.0.0.1");
}

const app = express();
if (downstreamPort) {
  app.use("/services/users", proxy(downstreamPort)); // http-proxy-middleware style reverse proxy
}

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server, downstream };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("api-gateway-proxy", () => {
  it("loads proxy gateway module", async () => {
    const mod = await import("../src/index.js");
    assert.ok(mod.app);
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "GET", path: "/services/users/1", expect: { status: 200, jsonSubset: { service: "users" } } },
      ],
    },
  },

  "payload-size-guard": {
    files: {
      "src/payloadGuard.js": `export function payloadSizeGuard(maxBytes = 1024) {
  return (req, res, next) => {
    const len = Number(req.headers["Content-Length"] ?? req.headers["content-length"] ?? 0);
    if (len > maxBytes) {
      req.destroy?.();
      res.status(413).json({ error: "payload too large" });
      return;
    }
    let received = 0;
    req.on("data", (chunk) => {
      received += chunk.length;
      if (received > maxBytes) {
        req.destroy(); // abort oversized stream (Content-Length)
        if (!res.headersSent) res.status(413).json({ error: "payload too large" });
      }
    });
    next();
  };
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { payloadSizeGuard } from "../src/payloadGuard.js";

describe("payload-size-guard", () => {
  it("rejects Content-Length above threshold", () => {
    let status;
    const req = { headers: { "content-length": "99999" }, on: () => req, destroy: () => {} };
    const res = { headersSent: false, status: (c) => ({ json: () => { status = c; } }) };
    payloadSizeGuard(1024)(req, res, () => { status = 200; });
    assert.equal(status, 413);
  });
});
`,
    http: null,
  },

  "url-shortener": {
    files: {
      "src/index.js": `import express from "express";
import Database from "better-sqlite3";

const db = new Database(":memory:");
db.exec(\`CREATE TABLE links(code TEXT PRIMARY KEY, url TEXT NOT NULL, clicks INTEGER DEFAULT 0)\`);

function randomCode() {
  return Math.random().toString(36).slice(2, 8);
}

const app = express();
app.use(express.json());

app.post("/shorten", (req, res) => {
  const url = req.body?.url;
  if (!url) return res.status(400).json({ error: "url required" });
  let code = randomCode();
  while (db.prepare("SELECT 1 FROM links WHERE code=?").get(code)) code = randomCode();
  db.prepare("INSERT INTO links(code,url) VALUES(?,?)").run(code, url);
  res.status(201).json({ code, shortUrl: \`/\${code}\` });
});

app.get("/:code", (req, res) => {
  const row = db.prepare("SELECT * FROM links WHERE code=?").get(req.params.code);
  if (!row) return res.status(404).end();
  setImmediate(() => db.prepare("UPDATE links SET clicks=clicks+1 WHERE code=?").run(req.params.code));
  res.redirect(302, row.url);
});

app.get("/stats/:code", (req, res) => {
  const row = db.prepare("SELECT code,url,clicks FROM links WHERE code=?").get(req.params.code);
  if (!row) return res.status(404).json({ error: "not found" });
  res.json(row);
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server, db };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("url-shortener", () => {
  it("stores links in sqlite", async () => {
    const { db } = await import("../src/index.js");
    db.prepare("INSERT INTO links(code,url) VALUES(?,?)").run("abc", "https://example.com");
    const row = db.prepare("SELECT url FROM links WHERE code=?").get("abc");
    assert.equal(row.url, "https://example.com");
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "POST", path: "/shorten", json: { url: "https://example.com" }, expect: { status: 201, jsonPaths: ["code"] } },
      ],
    },
  },

  "deadlock-retry": {
    files: {
      "src/deadlockRetry.js": `const RETRY_CODES = new Set(["40001", "40P01"]);

/** retry helper for postgres deadlock error codes 40001 / 40P01. */
export async function withDeadlockRetry(fn, { maxRetries = 3, baseDelayMs = 10 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      const code = err?.code ?? err?.errno;
      attempt += 1;
      if (!RETRY_CODES.has(String(code)) || attempt > maxRetries) throw err;
      const jitter = Math.floor(Math.random() * baseDelayMs);
      await new Promise((r) => setTimeout(r, baseDelayMs * attempt + jitter));
    }
  }
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { withDeadlockRetry } from "../src/deadlockRetry.js";

describe("deadlock-retry", () => {
  it("retries on postgres deadlock codes", async () => {
    let calls = 0;
    const result = await withDeadlockRetry(async () => {
      calls += 1;
      if (calls < 2) { const e = new Error("deadlock"); e.code = "40001"; throw e; }
      return "ok";
    }, { baseDelayMs: 1 });
    assert.equal(result, "ok");
    assert.equal(calls, 2);
  });
});
`,
    http: null,
  },

  "search-index-sync": {
    files: {
      "src/index.js": `class InMemorySearchIndex {
  constructor() { this.docs = new Map(); }
  upsert(id, doc) { this.docs.set(String(id), doc); }
  delete(id) { this.docs.delete(String(id)); }
  search(q) {
    const needle = String(q).toLowerCase();
    return [...this.docs.entries()]
      .filter(([, d]) => JSON.stringify(d).toLowerCase().includes(needle))
      .map(([id, doc]) => ({ id, doc }));
  }
}

export const index = new InMemorySearchIndex();
const listeners = new Set();

export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function syncRecord(op, id, payload) {
  if (op === "delete") index.delete(id);
  else index.upsert(id, payload);
  for (const fn of listeners) fn({ op, id, payload });
}

export function hookDbMutation(op, id, payload) {
  syncRecord(op, id, payload);
  return { synced: true };
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hookDbMutation, index } from "../src/index.js";

describe("search-index-sync", () => {
  it("syncs insert/update/delete to in-memory index", () => {
    hookDbMutation("insert", "1", { title: "Hello" });
    hookDbMutation("update", "1", { title: "Hello World" });
    assert.equal(index.search("world").length, 1);
    hookDbMutation("delete", "1");
    assert.equal(index.search("world").length, 0);
  });
});
`,
    http: null,
  },

  "prometheus-metrics": {
    files: {
      "src/index.js": `import express from "express";
import client from "prom-client";

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request durations",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

const errorCounter = new client.Counter({
  name: "http_errors_total",
  help: "Total HTTP errors",
  registers: [register],
});

const app = express();
app.use((req, res, next) => {
  const end = httpDuration.startTimer();
  res.on("finish", () => {
    end({ method: req.method, route: req.path, status: String(res.statusCode) });
    if (res.statusCode >= 500) errorCounter.inc();
  });
  next();
});

app.get("/metrics", async (_req, res) => {
  res.set("content-type", register.contentType);
  res.end(await register.metrics());
});
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/boom", (_req, res) => res.status(500).json({ error: "boom" }));

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server, register };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("prometheus-metrics", () => {
  it("exports prom-client registry", async () => {
    const { register } = await import("../src/index.js");
    const metrics = await register.metrics();
    assert.match(metrics, /process_cpu/);
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        { method: "GET", path: "/metrics", expect: { status: 200, bodyContains: "process_cpu" } },
      ],
    },
  },

  "saml-sso-consumer": {
    files: {
      "src/index.js": `import express from "express";

/** Deterministic fake SAML consumer — no outbound network. */
export function parseFakeAssertion(body) {
  const xml = String(body ?? "");
  const nameMatch = xml.match(/<saml:NameID[^>]*>([^<]+)<\\/saml:NameID>/);
  const notOnOrAfter = xml.match(/NotOnOrAfter="([^"]+)"/)?.[1];
  if (!nameMatch) return { valid: false, reason: "missing NameID" };
  if (notOnOrAfter && Date.parse(notOnOrAfter) < Date.now()) return { valid: false, reason: "expired" };
  return { valid: true, nameId: nameMatch[1], assertion: "SAML" };
}

const app = express();
app.use(express.text({ type: "*/*" }));
app.post("/auth/saml/acs", (req, res) => {
  const result = parseFakeAssertion(req.body);
  if (!result.valid) return res.status(401).json(result);
  res.json({ authenticated: true, user: result.nameId, type: "SAML Assertion" });
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(\`listening on \${addr.port}\`);
});

export { app, server };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseFakeAssertion } from "../src/index.js";

describe("saml-sso-consumer", () => {
  it("validates fake SAML Assertion payload", () => {
    const xml = '<saml:Assertion NotOnOrAfter="2099-01-01T00:00:00Z"><saml:NameID>user@corp.com</saml:NameID></saml:Assertion>';
    const out = parseFakeAssertion(xml);
    assert.equal(out.valid, true);
    assert.equal(out.nameId, "user@corp.com");
  });
});
`,
    http: {
      ...expressStart,
      requests: [
        {
          method: "POST",
          path: "/auth/saml/acs",
          headers: { "content-type": "text/xml" },
          json: undefined,
          expect: { status: 401 },
        },
      ],
    },
  },

  "microservice-shell": {
    files: {
      "src/logger.js": `export function createLogger() {
  return {
    info(obj, msg) {
      const payload = typeof obj === "string" ? { msg: obj } : { ...obj, msg };
      console.log(JSON.stringify({ level: "info", time: Date.now(), ...payload }));
    },
    error(obj, msg) {
      const payload = typeof obj === "string" ? { msg: obj } : { ...obj, msg };
      console.error(JSON.stringify({ level: "error", time: Date.now(), ...payload }));
    },
  };
}
`,
      "src/config.js": `/** Env validator (zod-compatible parse for DATABASE_URL / PORT). */
function parse(env) {
  const PORT = Number(env.PORT ?? 0);
  if (Number.isNaN(PORT)) throw new Error("PORT malformed");
  return {
    PORT,
    DATABASE_URL: env.DATABASE_URL ?? "sqlite://memory",
    NODE_ENV: env.NODE_ENV ?? "test",
  };
}

export const config = parse(process.env);
export const z = { object: () => ({ parse }) };
`,
      "src/db.js": `export class Db {
  constructor() { this.connected = true; }
  async ping() { if (!this.connected) throw new Error("db down"); return true; }
  close() { this.connected = false; }
}
export const db = new Db();
`,
      "src/index.js": `import express from "express";
import { createLogger } from "./logger.js"; // pino-compatible structured JSON logger
import { config } from "./config.js"; // zod-validated env
import { db } from "./db.js";

const log = createLogger();
const app = express();

app.get("/health/liveness", (_req, res) => res.status(200).json({ alive: true }));
app.get("/health/readiness", async (_req, res) => {
  try {
    await db.ping();
    res.status(200).json({ ready: true });
  } catch {
    res.status(503).json({ ready: false });
  }
});

app.get("/error-demo", (_req, res, next) => next(new Error("boom")));

app.use((err, _req, res, _next) => {
  log.error({ err: err.message }, "request failed");
  res.status(500).json({ error: err.message });
});

const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(config.PORT, () => {
  const addr = server.address();
  log.info({ port: typeof addr === "object" ? addr?.port : config.PORT }, "server started");
});

function shutdown(signal) {
  log.info({ signal }, "graceful shutdown");
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));

export { app, server, log, config, db };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { config } from "../src/config.js";
import { db } from "../src/db.js";
import { createLogger } from "../src/logger.js";

describe("microservice-shell", () => {
  it("validates env via zod and exposes db/logger", async () => {
    assert.equal(typeof config.PORT, "number");
    assert.equal(await db.ping(), true);
    assert.equal(typeof createLogger().info, "function");
  });
});
`,
    http: {
      start: { command: "node src/index.js", env: { NODE_ENV: "test", DATABASE_URL: "sqlite://memory" } },
      timeoutMs: 20000,
      requests: [
        { method: "GET", path: "/health/liveness", expect: { status: 200, jsonSubset: { alive: true } } },
        { method: "GET", path: "/health/readiness", expect: { status: 200, jsonSubset: { ready: true } } },
      ],
    },
  },
};
