import express from "express";

const connections = new Set();
const SHUTDOWN_MS = 10000;

const app = express();
app.get("/slow", (_req, res) => setTimeout(() => res.json({ ok: true }), 50));

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

if (typeof server.on === "function") {
  server.on("connection", (socket) => {
    connections.add(socket);
    socket.on("close", () => connections.delete(socket));
  });
}

export function gracefulShutdown() {
  return new Promise((resolve) => {
    server.close(() => resolve());
    const timer = setTimeout(() => {
      for (const socket of connections) socket.destroy();
      resolve();
    }, SHUTDOWN_MS);
    timer.unref?.();
  });
}

process.once("SIGTERM", () => gracefulShutdown());
process.once("SIGINT", () => gracefulShutdown());

export { app, server, connections, SHUTDOWN_MS };
