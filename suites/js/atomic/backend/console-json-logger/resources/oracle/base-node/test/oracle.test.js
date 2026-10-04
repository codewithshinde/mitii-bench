import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { logger } from "../src/jsonLogger.js";

describe("jsonLogger", () => {
  it("exports leveled logger methods", () => {
    assert.equal(typeof logger.info, "function");
    assert.equal(typeof logger.error, "function");
    assert.equal(typeof logger.warn, "function");
  });
});
