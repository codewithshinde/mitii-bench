export function payloadSizeGuard(maxBytes = 1024) {
  return (req, res, next) => {
    const len = Number(req.headers["content-length"] ?? 0);
    if (len > maxBytes) {
      req.destroy?.();
      res.status(413).json({ error: "payload too large" });
      return;
    }
    let received = 0;
    req.on("data", (chunk) => {
      received += chunk.length;
      if (received > maxBytes) {
        req.destroy();
        if (!res.headersSent) res.status(413).json({ error: "payload too large" });
      }
    });
    next();
  };
}
