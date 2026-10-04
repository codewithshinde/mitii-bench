import express from "express";

/** Deterministic fake SAML consumer — no outbound network. */
export function parseFakeAssertion(body) {
  const xml = String(body ?? "");
  const nameMatch = xml.match(/<saml:NameID[^>]*>([^<]+)<\/saml:NameID>/);
  const notOnOrAfter = xml.match(/NotOnOrAfter="([^"]+)"/)?.[1];
  if (!nameMatch) return { valid: false, reason: "missing NameID" };
  if (notOnOrAfter && Date.parse(notOnOrAfter) < Date.now()) return { valid: false, reason: "expired" };
  return { valid: true, nameId: nameMatch[1], assertion: "SAML" };
}

const app = express();
app.use(express.text({ type: "*/*" }));
app.post("/auth/saml/acs", (req, res) => {
  const result = parseFakeAssertion(req.body);
  if (!result.valid) return res.status(401).json(result);
  res.json({ authenticated: true, user: result.nameId, type: "SAML Assertion" });
});

const port = Number(process.env.PORT || 0);
const server = app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server };
