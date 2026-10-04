import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseFakeAssertion } from "../src/index.js";

describe("saml-sso-consumer", () => {
  it("validates fake SAML Assertion payload", () => {
    const xml = '<saml:Assertion NotOnOrAfter="2099-01-01T00:00:00Z"><saml:NameID>user@corp.com</saml:NameID></saml:Assertion>';
    const out = parseFakeAssertion(xml);
    assert.equal(out.valid, true);
    assert.equal(out.nameId, "user@corp.com");
  });
});
