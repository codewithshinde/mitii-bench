import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { config } from "../src/config.js";
import { db } from "../src/db.js";
import { createLogger } from "../src/logger.js";

describe("microservice-shell", () => {
  it("validates env via zod and exposes db/logger", async () => {
    assert.equal(typeof config.PORT, "number");
    assert.equal(await db.ping(), true);
    assert.equal(typeof createLogger().info, "function");
  });
});
