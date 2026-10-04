import express from "express";

export const auditLog = [];

export function auditMiddleware(req, res, next) {
  const mutating = ["POST", "PUT", "DELETE"].includes(req.method);
  if (!mutating) return next();
  const started = Date.now();
  res.on("finish", () => {
    auditLog.push({
      userId: req.header("x-user-id") ?? "anonymous",
      method: req.method,
      path: req.path,
      ip: req.ip ?? req.socket?.remoteAddress ?? "unknown",
      status: res.statusCode,
      at: new Date(started).toISOString(),
      body: req.body,
    });
  });
  next();
}

const app = express();
app.use(express.json());
app.use(auditMiddleware);
app.post("/resources", (req, res) => res.status(201).json({ id: 1, ...req.body }));
app.delete("/resources/:id", (req, res) => res.status(204).end());

const port = Number(process.env.PORT || 0);
const server = app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server };
