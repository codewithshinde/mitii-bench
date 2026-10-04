import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SHUTDOWN_MS, connections } from "../src/index.js";

describe("graceful-http-teardown", () => {
  it("tracks open connections with 10s drain budget", () => {
    assert.equal(SHUTDOWN_MS, 10000);
    assert.ok(connections instanceof Set);
  });
});
