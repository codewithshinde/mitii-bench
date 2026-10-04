const SENSITIVE = new Set(["ssn", "creditcard", "credit_card", "password"]);

export function maskSensitive(input) {
  if (Array.isArray(input)) return input.map((v) => maskSensitive(v));
  if (!input || typeof input !== "object") return input;
  const out = {};
  for (const [key, value] of Object.entries(input)) {
    const norm = key.toLowerCase().replace(/[^a-z]/g, "");
    if (SENSITIVE.has(norm)) {
      out[key] = "***REDACTED***";
    } else if (value && typeof value === "object") {
      out[key] = maskSensitive(value);
    } else {
      out[key] = value;
    }
  }
  return out;
}
