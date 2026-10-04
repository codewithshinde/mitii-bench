import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { acquireLock, redis } from "../src/index.js";

describe("cron-redis-lock", () => {
  it("uses in-memory lock semantics", async () => {
    const t1 = await acquireLock("job", 1000);
    const t2 = await acquireLock("job", 1000);
    assert.ok(t1);
    assert.equal(t2, null);
    assert.ok(redis);
  });
});
