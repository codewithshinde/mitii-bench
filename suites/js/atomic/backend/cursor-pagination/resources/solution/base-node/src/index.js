import express from "express";

const items = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

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
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server, encodeCursor, decodeCursor };
