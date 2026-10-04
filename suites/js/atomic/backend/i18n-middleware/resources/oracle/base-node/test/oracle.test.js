import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { i18nMiddleware } from "../src/index.js";

describe("i18n-middleware", () => {
  it("injects req.__ translator from Accept-Language", () => {
    const req = { header: (h) => (h === "Accept-Language" ? "es-ES" : undefined) };
    i18nMiddleware(req, {}, () => {});
    assert.equal(req.__("greeting"), "Hola");
  });
});
