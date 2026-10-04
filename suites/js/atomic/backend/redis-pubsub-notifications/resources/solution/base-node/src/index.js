import express from "express";
import { createServer } from "node:http";
import { EventEmitter } from "node:events";

class InMemoryRedisPubSub {
  constructor() { this.channels = new Map(); }
  publish(channel, message) {
    for (const fn of this.channels.get(channel) ?? []) fn(message);
    return 1;
  }
  subscribe(channel, fn) {
    if (!this.channels.has(channel)) this.channels.set(channel, new Set());
    this.channels.get(channel).add(fn);
    return () => this.channels.get(channel)?.delete(fn);
  }
}

export const bus = new InMemoryRedisPubSub();
const app = express();
const httpServer = createServer(app);
const io = new EventEmitter(); // socket.io-compatible fan-out for tests

io.on("connection", (socket) => {
  socket.on("subscribe", (channel) => {
    const off = bus.subscribe(channel, (msg) => socket.emit("notification", { channel, msg }));
    socket.on("disconnect", off);
  });
});

app.post("/notify", express.json(), (req, res) => {
  const { channel = "alerts", message = "" } = req.body ?? {};
  bus.publish(channel, message);
  res.json({ published: true });
});

const port = Number(process.env.PORT || 0);
if (process.env.MITII_NO_LISTEN !== "1") {
  httpServer.listen(port, () => {
    const addr = httpServer.address();
    if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
  });
}

export { app, httpServer, io };
