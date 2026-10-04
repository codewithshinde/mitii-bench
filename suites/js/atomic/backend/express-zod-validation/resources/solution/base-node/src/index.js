import express from "express";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(18),
  password: z.string().min(8),
});

export function validateUserBody(req, res, next) {
  const parsed = userSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      errors: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }
  req.validated = parsed.data;
  next();
}

export const app = express();
app.use(express.json());
app.post("/api/users", validateUserBody, (req, res) => {
  res.status(201).json({ user: req.validated });
});

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(`listening on ${address.port}`);
});
