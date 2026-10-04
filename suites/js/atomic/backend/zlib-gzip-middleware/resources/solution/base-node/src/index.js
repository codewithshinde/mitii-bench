import http from "node:http";
import { sendMaybeCompressed } from "./gzipMiddleware.js";

export const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (req.method === "GET" && url.pathname === "/data") {
    sendMaybeCompressed(req, res, { message: "hello" });
    return;
  }
  res.writeHead(404);
  res.end();
});

const port = Number(process.env.PORT || 0);
if (process.env.MITII_NO_LISTEN !== "1") {
  server.listen(port);
}
