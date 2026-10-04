import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "mitii-test-secret";

export function authenticateToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}
