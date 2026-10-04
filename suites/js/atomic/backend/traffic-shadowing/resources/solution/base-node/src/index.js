import express from "express";

export const shadowLog = [];

export function shadowMiddleware(stagingUrl) {
  return (req, res, next) => {
    setImmediate(() => {
      shadowLog.push({
        method: req.method,
        path: req.originalUrl ?? req.url,
        stagingUrl,
        at: Date.now(),
      });
    });
    next();
  };
}

const app = express();
app.use(express.json());
app.use(shadowMiddleware("http://staging.internal"));
app.get("/api/data", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server };
