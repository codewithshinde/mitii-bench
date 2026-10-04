import express from "express";

const failures = new Map();
const bans = new Map();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_FAILS = 10;

export function record401(ip) {
  const now = Date.now();
  const arr = (failures.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  failures.set(ip, arr);
  if (arr.length > MAX_FAILS) bans.set(ip, now + WINDOW_MS);
}

export function ipBanMiddleware(req, res, next) {
  const ip = req.ip ?? "127.0.0.1";
  const until = bans.get(ip) ?? 0;
  if (until > Date.now()) return res.status(403).json({ error: "banned" });
  next();
}

const app = express();
app.use(express.json());
app.use(ipBanMiddleware);
app.post("/login", (req, res) => {
  const ip = req.ip ?? "127.0.0.1";
  if (req.body?.password !== "secret") {
    record401(ip);
    return res.status(401).json({ error: "unauthorized" });
  }
  res.json({ ok: true });
});

const port = Number(process.env.PORT || 0);
const server = app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server, bans, MAX_FAILS, WINDOW_MS };
