import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { io as ioClient } from "socket.io-client";
import { createAuthedServer } from "../src/socketAuth.js";

describe("socket auth handshake", () => {
  it("rejects missing token and accepts valid JWT", async () => {
    const { httpServer, sign } = createAuthedServer();
    await new Promise((r) => httpServer.listen(0, r));
    const port = httpServer.address().port;
    const url = `http://127.0.0.1:${port}`;

    const bad = ioClient(url, { transports: ["websocket"], auth: {} });
    const badResult = await new Promise((resolve) => {
      bad.on("connect_error", (err) => resolve(err.message));
      bad.on("connect", () => resolve("connected"));
    });
    assert.match(String(badResult), /Unauthorized|xhr poll/i);
    bad.close();

    const token = sign({ sub: "user-42" });
    const good = ioClient(url, { transports: ["websocket"], auth: { token } });
    const payload = await new Promise((resolve) => {
      good.on("ready", resolve);
    });
    assert.equal(payload.sub, "user-42");
    good.close();
    httpServer.close();
  });
});
