import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { logger } from "../src/jsonLogger.js";

describe("jsonLogger", () => {
  it("writes JSON lines with severity and timestamp", () => {
    const chunks = [];
    const original = process.stdout.write;
    process.stdout.write = (chunk) => {
      chunks.push(String(chunk));
      return true;
    };
    try {
      logger.info("hello");
      const line = JSON.parse(chunks[0]);
      assert.equal(line.severity, "info");
      assert.equal(line.message, "hello");
      assert.match(line.timestamp, /^\d{4}-\d{2}-\d{2}T/);
    } finally {
      process.stdout.write = original;
    }
  });

  it("routes errors to stderr", () => {
    const chunks = [];
    const original = process.stderr.write;
    process.stderr.write = (chunk) => {
      chunks.push(String(chunk));
      return true;
    };
    try {
      logger.error("boom");
      const line = JSON.parse(chunks[0]);
      assert.equal(line.severity, "error");
      assert.equal(line.message, "boom");
    } finally {
      process.stderr.write = original;
    }
  });
});
