import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const store = new Map();
const TTL_MS = 15 * 60 * 1000;

function hashToken(token) {
  const salt = "reset-salt";
  return scryptSync(token, salt, 32).toString("hex");
}

export function requestReset(email) {
  const token = randomBytes(24).toString("hex");
  store.set(email, { hash: hashToken(token), expiresAt: Date.now() + TTL_MS });
  return { token, link: `/reset?token=${token}&email=${encodeURIComponent(email)}` };
}

export function resetPassword(email, token, newPassword) {
  const row = store.get(email);
  if (!row || row.expiresAt < Date.now()) return { ok: false, reason: "expired" };
  const provided = Buffer.from(hashToken(token), "hex");
  const expected = Buffer.from(row.hash, "hex");
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return { ok: false, reason: "invalid" };
  }
  store.delete(email);
  return { ok: true, password: newPassword };
}
