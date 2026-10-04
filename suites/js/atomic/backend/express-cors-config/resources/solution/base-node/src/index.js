import express from "express";
import { corsMiddleware } from "./corsMiddleware.js";

export const app = express();
app.use(corsMiddleware);
app.get("/data", (_req, res) => {
  res.setHeader("X-Total-Count", "10");
  res.json({ rows: [] });
});

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(`listening on ${address.port}`);
});
