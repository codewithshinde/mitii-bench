import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

describe("http-native-server", () => {
  /** @type {import("node:http").Server} */
  let listening;

  before(async () => {
    process.env.MITII_NO_LISTEN = "1";
    const mod = await import("../src/index.js");
    listening = await new Promise((resolve, reject) => {
      mod.server.listen(0, "127.0.0.1", () => resolve(mod.server));
      mod.server.once("error", reject);
    });
  });

  after(async () => {
    await new Promise((resolve) => listening.close(resolve));
  });

  function request(method, path, body) {
    const address = listening.address();
    const port = typeof address === "object" && address ? address.port : 0;
    return new Promise((resolve, reject) => {
      const req = http.request(
        { hostname: "127.0.0.1", port, path, method, headers: body ? { "content-type": "application/json" } : {} },
        (res) => {
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8") }));
        },
      );
      req.on("error", reject);
      if (body) req.end(JSON.stringify(body));
      else req.end();
    });
  }

  it("GET /health returns ok status and uptime", async () => {
    const res = await request("GET", "/health");
    assert.equal(res.status, 200);
    const json = JSON.parse(res.body);
    assert.equal(json.status, "ok");
    assert.equal(typeof json.uptime, "number");
  });

  it("POST /echo returns parsed JSON body", async () => {
    const res = await request("POST", "/echo", { hello: "world" });
    assert.equal(res.status, 200);
    assert.deepEqual(JSON.parse(res.body), { hello: "world" });
  });

  it("returns 404 for unknown routes", async () => {
    const res = await request("GET", "/missing");
    assert.equal(res.status, 404);
  });
});
