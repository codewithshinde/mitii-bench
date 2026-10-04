import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { negotiateResponse } from "../src/contentNegotiation.js";

describe("content-negotiation", () => {
  it("returns xml/json/text based on Accept", () => {
    const json = negotiateResponse({ headers: { accept: "application/json" } }, { ok: true });
    assert.equal(json.type, "application/json");
    const xml = negotiateResponse({ headers: { accept: "application/xml" } }, { ok: true });
    assert.match(xml.body, /<ok>true<\/ok>/);
  });
});
