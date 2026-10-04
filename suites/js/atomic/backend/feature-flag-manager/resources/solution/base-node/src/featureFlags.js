import { createHash } from "node:crypto";

const flags = new Map();

/** Configure percentage rollout for a feature key (0–100). */
export function setFeatureRollout(key, pct) {
  flags.set(key, { pct: Math.max(0, Math.min(100, Number(pct))), rollout: true });
}

function bucket(userId, key) {
  const hash = createHash("sha256").update(String(userId) + String(key)).digest();
  return hash[0] % 100;
}

export function isFeatureEnabled(featureKey, userContext = {}) {
  const cfg = flags.get(featureKey);
  if (!cfg) return false;
  const userId = userContext.userId ?? userContext.id ?? "anon";
  return bucket(userId, featureKey) < cfg.pct;
}
