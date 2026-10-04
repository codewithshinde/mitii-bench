import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = /** @type {Buffer} */ (await scryptAsync(password, salt, 64));
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password, stored) {
  const [salt, keyHex] = String(stored).split(":");
  if (!salt || !keyHex) return false;
  const derived = /** @type {Buffer} */ (await scryptAsync(password, salt, 64));
  const key = Buffer.from(keyHex, "hex");
  if (key.length !== derived.length) return false;
  return timingSafeEqual(key, derived);
}
