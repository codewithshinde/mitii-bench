import express from "express";
import os from "node:os";

const app = express();

app.get("/api/events", (req, res) => {
  res.setHeader("content-type", "text/event-stream");
  res.setHeader("cache-control", "no-cache");
  res.flushHeaders?.();
  const timer = setInterval(() => {
    const payload = { load: os.loadavg()[0], ts: Date.now() };
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }, 1000);
  req.on("close", () => clearInterval(timer));
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server };
