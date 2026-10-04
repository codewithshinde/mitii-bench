import express from "express";

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
const server = app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server, fakeDb, fakeRedis };
