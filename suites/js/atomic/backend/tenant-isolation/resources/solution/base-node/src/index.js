import express from "express";

const tenantData = new Map();

export function tenantMiddleware(req, res, next) {
  const header = req.header("x-tenant-id");
  const host = req.hostname ?? "";
  const sub = host.split(".")[0];
  const tenant = header || (sub !== "localhost" ? sub : "default");
  if (!tenant) return res.status(400).json({ error: "tenant required" });
  req.tenant = tenant;
  if (!tenantData.has(tenant)) tenantData.set(tenant, { items: [] });
  req.tenantStore = tenantData.get(tenant);
  next();
}

const app = express();
app.use(express.json());
app.use(tenantMiddleware);

app.get("/items", (req, res) => res.json({ tenant: req.tenant, items: req.tenantStore.items }));
app.post("/items", (req, res) => {
  const item = { id: req.tenantStore.items.length + 1, name: req.body?.name ?? "item" };
  req.tenantStore.items.push(item);
  res.status(201).json(item);
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server, tenantData };
