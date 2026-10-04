import zlib from "node:zlib";

export function shouldCompress(req) {
  const accept = String(
    req.headers["Accept-Encoding"] ?? req.headers["accept-encoding"] ?? "",
  );
  return accept.includes("gzip");
}

export function sendMaybeCompressed(req, res, body, contentType = "application/json") {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  if (!shouldCompress(req)) {
    res.writeHead(200, { "content-type": contentType });
    res.end(payload);
    return;
  }
  const gzip = zlib.createGzip();
  const chunks = [];
  gzip.on("data", (chunk) => chunks.push(chunk));
  gzip.on("error", () => {
    res.writeHead(500);
    res.end("compression failed");
  });
  gzip.on("end", () => {
    res.writeHead(200, {
      "content-type": contentType,
      "content-encoding": "gzip",
    });
    res.end(Buffer.concat(chunks));
  });
  gzip.end(payload);
}
