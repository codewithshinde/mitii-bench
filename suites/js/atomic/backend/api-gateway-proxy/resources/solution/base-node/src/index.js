import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { createServer } from "node:net";
import { createServer as createHttpServer } from "node:http";

function getFreePort() {
  return new Promise((resolve, reject) => {
    const s = createServer();
    s.listen(0, "127.0.0.1", () => {
      const port = s.address().port;
      s.close(() => resolve(port));
    });
    s.on("error", reject);
  });
}

let downstreamPort = 0;
let downstream = null;
if (process.env.MITII_NO_LISTEN !== "1") {
  downstreamPort = await getFreePort();
  downstream = createHttpServer((req, res) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ service: "users", path: req.url }));
  });
  downstream.listen(downstreamPort, "127.0.0.1");
}

const app = express();
if (downstreamPort) {
  app.use(
    "/services/users",
    createProxyMiddleware({
      target: `http://127.0.0.1:${downstreamPort}`,
      changeOrigin: true,
      pathRewrite: { "^/services/users": "" },
    }),
  );
}

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server, downstream };
