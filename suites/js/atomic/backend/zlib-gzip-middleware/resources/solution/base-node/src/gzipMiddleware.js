import zlib from "node:zlib";

export function shouldCompress(req) {
  const accept = String(req.headers["accept-encoding"] ?? "");
  return accept.includes("gzip");
}

export function sendMaybeCompressed(req, res, body, contentType = "application/json") {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  if (!shouldCompress(req)) {
    res.writeHead(200, { "content-type": contentType });
    res.end(payload);
    return;
  }
  zlib.gzip(Buffer.from(payload), (err, compressed) => {
    if (err) {
      res.writeHead(500);
      res.end("compression failed");
      return;
    }
    res.writeHead(200, {
      "content-type": contentType,
      "content-encoding": "gzip",
    });
    res.end(compressed);
  });
}
