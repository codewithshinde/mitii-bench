import express from "express";
import { rateLimitMiddleware } from "./rateLimit.js";

export const app = express();
app.set("trust proxy", true);
app.use(rateLimitMiddleware);
app.get("/ping", (_req, res) => res.json({ pong: true }));

const port = Number(process.env.PORT || 0);
export const server = app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(`listening on ${address.port}`);
});
