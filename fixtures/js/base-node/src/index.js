import express from "express";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Stubs — cases implement these.
app.get("/todos", (_req, res) => {
  res.status(501).json({ error: "not implemented" });
});

app.post("/todos", (_req, res) => {
  res.status(501).json({ error: "not implemented" });
});

app.get("/get-cards", (_req, res) => {
  res.status(501).json({ error: "not implemented" });
});

app.get("/cards", (_req, res) => {
  const rows = db.prepare("SELECT id, title, suit FROM cards ORDER BY id").all();
  res.json(rows);
});

app.get("/", (_req, res) => {
  const htmlPath = join(__dirname, "public", "index.html");
  if (!existsSync(htmlPath)) {
    res.type("text").send("base-node");
    return;
  }
  res.type("html").send(readFileSync(htmlPath, "utf8"));
});

const port = Number(process.env.PORT || 0);
const server = app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") {
    console.log(`listening on ${address.port}`);
  }
});

export { app, db, server };
