import express from "express";
import Database from "better-sqlite3";
import { Readable } from "node:stream";

const db = new Database(":memory:");
db.exec("CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT, email TEXT)");
const insert = db.prepare("INSERT INTO users(name,email) VALUES(?,?)");
for (let i = 1; i <= 5; i++) insert.run(`User ${i}`, `u${i}@example.com`);

function csvEscape(v) {
  const s = String(v ?? "");
  return s.includes(",") || s.includes('"') ? `"${s.replaceAll('"', '""')}"` : s;
}

const app = express();
app.get("/export/users.csv", (_req, res) => {
  res.setHeader("content-type", "text/csv");
  res.write("id,name,email\n");
  const stmt = db.prepare("SELECT id,name,email FROM users ORDER BY id");
  const stream = Readable.from(
    (function* () {
      for (const row of stmt.iterate()) {
        yield `${row.id},${csvEscape(row.name)},${csvEscape(row.email)}\n`;
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
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server, db };
