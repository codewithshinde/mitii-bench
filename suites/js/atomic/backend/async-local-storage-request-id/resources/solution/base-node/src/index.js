import http from "node:http";
import { requestIdMiddleware, logWithContext } from "./requestContext.js";

export const server = http.createServer((req, res) => {
  requestIdMiddleware(req, res, () => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (req.method === "GET" && url.pathname === "/context") {
      const entry = logWithContext("handled request");
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(entry));
      return;
    }
    res.writeHead(404);
    res.end();
  });
});

const port = Number(process.env.PORT || 0);
if (process.env.MITII_NO_LISTEN !== "1") {
  server.listen(port);
}
