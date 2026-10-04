export function truncate(value, maxLen) {
  if (value == null) return "";
  const str = String(value);
  const n = Number(maxLen);
  if (!Number.isFinite(n) || n <= 0) return "";
  if (str.length <= n) return str;
  return str.slice(0, n);
}
