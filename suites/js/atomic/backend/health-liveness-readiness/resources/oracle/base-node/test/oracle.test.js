import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { setReadiness, fakeDb, fakeRedis } from "../src/index.js";

describe("health-liveness-readiness", () => {
  it("flips readiness when dependencies drop", () => {
    setReadiness({ db: false, redis: true });
    assert.equal(fakeDb.connected, false);
    setReadiness({ db: true, redis: true });
    assert.equal(fakeRedis.connected, true);
  });
});
