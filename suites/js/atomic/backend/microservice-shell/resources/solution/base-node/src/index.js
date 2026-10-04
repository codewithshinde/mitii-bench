import express from "express";
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
