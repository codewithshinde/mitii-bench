import express from "express";
import Database from "better-sqlite3";

const db = new Database(":memory:");
db.exec(`CREATE TABLE links(code TEXT PRIMARY KEY, url TEXT NOT NULL, clicks INTEGER DEFAULT 0)`);

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
  res.status(201).json({ code, shortUrl: `/${code}` });
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
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server, db };
