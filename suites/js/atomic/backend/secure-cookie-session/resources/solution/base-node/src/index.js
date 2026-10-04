import express from "express";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

const KEY = scryptSync(process.env.SESSION_SECRET || "test-secret", "salt", 32);

function seal(data) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", KEY, iv);
  const enc = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

function open(token) {
  const buf = Buffer.from(token, "base64url");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const enc = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", KEY, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return JSON.parse(dec.toString("utf8"));
}

export function sessionMiddleware(req, res, next) {
  const raw = req.headers.cookie?.match(/sid=([^;]+)/)?.[1];
  req.session = raw ? open(raw) : {};
  res.setSession = (data) => {
    const token = seal(data);
    res.setHeader("Set-Cookie", `sid=${token}; HttpOnly; Secure; SameSite=Strict; Path=/`);
  };
  next();
}

const app = express();
app.use(sessionMiddleware);
app.post("/login", (req, res) => {
  res.setSession({ userId: req.body?.userId ?? "guest" });
  res.json({ ok: true });
});
app.get("/me", (req, res) => res.json(req.session));

const port = Number(process.env.PORT || 0);
const server = app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server, seal, open };
