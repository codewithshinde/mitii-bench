import express from "express";
import { createHash, randomBytes } from "node:crypto";
import Database from "better-sqlite3";

const db = new Database(":memory:");
db.exec(`CREATE TABLE api_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  usage_count INTEGER NOT NULL DEFAULT 0
)`);

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
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server, db };
