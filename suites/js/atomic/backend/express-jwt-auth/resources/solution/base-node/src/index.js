import express from "express";
import { authenticateToken, signToken } from "./authenticateToken.js";

export const app = express();
app.use(express.json());
app.post("/login", (req, res) => {
  const token = signToken({ sub: req.body.username || "demo", role: "user" });
  res.json({ token });
});
app.get("/protected", authenticateToken, (req, res) => res.json({ user: req.user }));

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(`listening on ${address.port}`);
});
