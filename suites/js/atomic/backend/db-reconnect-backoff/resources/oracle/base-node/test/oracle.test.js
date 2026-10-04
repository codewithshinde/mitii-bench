import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ReconnectingDb } from "../src/index.js";

describe("db-reconnect-backoff", () => {
  it("retries with exponential backoff", async () => {
    process.env.FORCE_DB_FAIL = "1";
    const db = new ReconnectingDb({ maxRetries: 3, baseDelayMs: 1 });
    await db.connect();
    assert.equal(db.connected, true);
    delete process.env.FORCE_DB_FAIL;
  });
});
