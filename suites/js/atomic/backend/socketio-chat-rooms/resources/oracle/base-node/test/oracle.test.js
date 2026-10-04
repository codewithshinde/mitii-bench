import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { io as ioClient } from "socket.io-client";
import { createChatServer } from "../src/chat.js";

describe("socket.io rooms", () => {
  it("broadcasts messages only within a room", async () => {
    const { httpServer } = createChatServer();
    await new Promise((resolve) => httpServer.listen(0, resolve));
    const port = httpServer.address().port;
    const url = `http://127.0.0.1:${port}`;

    const a = ioClient(url, { transports: ["websocket"] });
    const b = ioClient(url, { transports: ["websocket"] });
    const c = ioClient(url, { transports: ["websocket"] });

    await Promise.all([
      new Promise((r) => a.on("connect", r)),
      new Promise((r) => b.on("connect", r)),
      new Promise((r) => c.on("connect", r)),
    ]);

    a.emit("join-room", { roomId: "r1" });
    b.emit("join-room", { roomId: "r1" });
    c.emit("join-room", { roomId: "r2" });

    await new Promise((r) => setTimeout(r, 50));

    const received = [];
    b.on("message", (m) => received.push(m));
    c.on("message", (m) => received.push({ wrongRoom: true, ...m }));

    a.emit("send-message", { roomId: "r1", message: "hello" });
    await new Promise((r) => setTimeout(r, 100));

    assert.ok(received.some((m) => m.message === "hello" && m.roomId === "r1"));
    assert.ok(!received.some((m) => m.wrongRoom));

    a.close();
    b.close();
    c.close();
    httpServer.close();
  });
});
