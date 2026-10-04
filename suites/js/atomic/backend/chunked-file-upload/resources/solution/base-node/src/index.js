import express from "express";
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
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server, uploads, UPLOAD_DIR };
