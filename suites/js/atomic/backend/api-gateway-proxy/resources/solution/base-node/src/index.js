import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
app.use(express.json());

const userServicePort = process.env.USER_SERVICE_PORT;
if (userServicePort) {
  app.use(
    "/services/users",
    createProxyMiddleware({
      target: `http://127.0.0.1:${userServicePort}`,
      changeOrigin: true,
    }),
  );
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const port = Number(process.env.PORT || 0);
const server =
  process.env.MITII_NO_LISTEN === "1"
    ? { close(cb) { cb?.(); }, address: () => null }
    : app.listen(port, () => {
        const addr = server.address();
        if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
      });

export { app, server };
