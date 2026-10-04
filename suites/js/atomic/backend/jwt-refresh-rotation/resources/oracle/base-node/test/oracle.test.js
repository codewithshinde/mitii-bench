import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { issueTokenPair, refreshTokens } from "../src/tokens.js";

describe("refresh token rotation", () => {
  it("issues pair and rotates refresh token", async () => {
    const first = await issueTokenPair("user-1");
    assert.ok(first.accessToken);
    assert.ok(first.refreshToken);
    const second = await refreshTokens(first.refreshToken);
    assert.notEqual(second.refreshToken, first.refreshToken);
    await assert.rejects(() => refreshTokens(first.refreshToken), /Invalid refresh token/);
  });
});
