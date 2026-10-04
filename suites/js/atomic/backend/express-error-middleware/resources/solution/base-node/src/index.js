import express from "express";
import { errorMiddleware } from "./errorMiddleware.js";

export const app = express();
app.use(express.json());

app.get("/ok", (_req, res) => res.json({ ok: true }));

app.get("/boom", (_req, _res, next) => {
  const err = new Error("Something broke");
  err.statusCode = 418;
  next(err);
});

app.get("/fail", (_req, _res, next) => next(new Error("Internal failure")));

app.use(errorMiddleware);

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") {
    console.log(`listening on ${address.port}`);
  }
});
