function toXml(obj) {
  const entries = Object.entries(obj ?? {}).map(([k, v]) => `<${k}>${v}</${k}>`).join("");
  return `<?xml version="1.0"?><response>${entries}</response>`;
}

export function negotiateResponse(req, data) {
  const accept = String(req.headers?.Accept ?? req.headers?.accept ?? "application/json").toLowerCase();
  if (accept.includes("application/xml") || accept.includes("text/xml")) {
    return { type: "application/xml", body: toXml(data) };
  }
  if (accept.includes("text/plain")) {
    return { type: "text/plain", body: JSON.stringify(data) };
  }
  return { type: "application/json", body: JSON.stringify(data) };
}

export function contentNegotiationMiddleware(req, res, next) {
  res.formatPayload = (data) => {
    const out = negotiateResponse(req, data);
    res.type(out.type).send(out.body);
  };
  next();
}
