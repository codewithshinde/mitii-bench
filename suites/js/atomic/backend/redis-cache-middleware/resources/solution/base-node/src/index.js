import express from "express";
import { cacheMiddleware } from "./cacheMiddleware.js";

export const app = express();
app.use(cacheMiddleware);
app.get("/api/items", (_req, res) => res.json({ items: [1, 2, 3] }));

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(`listening on ${address.port}`);
});
