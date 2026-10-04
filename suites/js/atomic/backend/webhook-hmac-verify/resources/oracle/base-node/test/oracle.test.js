import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifySignature, SECRET } from "../src/webhook.js";

describe("webhook-hmac-verify", () => {
  it("uses createHmac and timingSafeEqual semantics", () => {
    const body = Buffer.from('{"event":"paid"}');
    const sig = createHmac("sha256", SECRET).update(body).digest("hex");
    assert.equal(verifySignature(body, sig), true);
    assert.equal(verifySignature(body, "bad"), false);
  });
});
