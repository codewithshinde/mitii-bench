import express from "express";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

const secrets = new Map();

const app = express();
app.use(express.json());

app.post("/2fa/generate", async (req, res) => {
  const userId = req.body?.userId ?? "user";
  const secret = speakeasy.generateSecret({ name: `Mitii (${userId})` });
  secrets.set(userId, secret.base32);
  const qr = await QRCode.toDataURL(secret.otpauth_url);
  res.json({ secret: secret.base32, qr });
});

app.post("/2fa/verify", (req, res) => {
  const userId = req.body?.userId ?? "user";
  const token = String(req.body?.token ?? "");
  const base32 = secrets.get(userId);
  if (!base32) return res.status(400).json({ error: "no secret" });
  const ok = speakeasy.totp.verify({ secret: base32, encoding: "base32", token, window: 1 });
  res.json({ valid: ok });
});

const port = Number(process.env.PORT || 0);
const server = app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server, secrets };
