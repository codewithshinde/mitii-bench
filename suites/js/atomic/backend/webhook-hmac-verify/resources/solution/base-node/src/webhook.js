import express from "express";
import { createHmac, timingSafeEqual } from "node:crypto";

export const SECRET = process.env.WEBHOOK_SECRET || "whsec_test";

export function verifySignature(rawBody, signatureHeader) {
  if (!signatureHeader) return false;
  const expected = createHmac("sha256", SECRET).update(rawBody).digest("hex");
  const provided = String(signatureHeader).replace(/^sha256=/, "");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(provided, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

const app = express();
app.post("/webhook", express.raw({ type: "*/*" }), (req, res) => {
  const sig = req.header("x-signature");
  const raw = req.body ?? Buffer.alloc(0);
  if (!verifySignature(raw, sig)) return res.status(401).json({ error: "invalid signature" });
  res.json({ received: true });
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server };
