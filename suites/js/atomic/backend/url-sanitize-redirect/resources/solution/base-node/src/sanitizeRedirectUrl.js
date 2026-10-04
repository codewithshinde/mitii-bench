const ALLOWED_HOSTS = new Set(["example.com", "www.example.com", "app.example.com"]);
const STRIP_PARAMS = new Set(["utm_source", "utm_medium", "utm_campaign", "fbclid", "gclid"]);

export function sanitizeRedirectUrl(rawUrl) {
  let url;
  try {
    url = new URL(String(rawUrl));
  } catch {
    throw new Error("Invalid URL");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Unsupported protocol");
  }
  if (!ALLOWED_HOSTS.has(url.hostname)) {
    throw new Error("Host not allowed");
  }
  for (const key of [...url.searchParams.keys()]) {
    if (STRIP_PARAMS.has(key)) url.searchParams.delete(key);
  }
  return url.toString();
}
