/** CORS middleware for custom origin and header rules. */
const ALLOWED_METHODS = "GET, POST, PUT, DELETE";
const EXPOSED = "X-Total-Count";

function originAllowed(origin) {
  if (!origin) return true;
  try {
    const { hostname } = new URL(origin);
    return hostname === "example.com" || hostname.endsWith(".example.com");
  } catch {
    return false;
  }
}

export function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  if (origin && originAllowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", ALLOWED_METHODS);
  res.setHeader("Access-Control-Expose-Headers", EXPOSED);
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
}
