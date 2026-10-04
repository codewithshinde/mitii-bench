import express from "express";
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
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server, register };
