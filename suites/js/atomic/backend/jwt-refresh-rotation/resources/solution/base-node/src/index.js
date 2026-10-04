import express from "express";
import { refreshTokens } from "./tokens.js";

export const app = express();
app.use(express.json());
app.post("/token/refresh", async (req, res) => {
  try {
    const tokens = await refreshTokens(req.body.refreshToken);
    res.json(tokens);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(`listening on ${address.port}`);
});
