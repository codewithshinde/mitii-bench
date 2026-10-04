import express from "express";
import fs from "node:fs";
import { join } from "node:path";

const CONFIG_PATH = join(process.cwd(), "config.json");
if (!fs.existsSync(CONFIG_PATH)) {
  fs.mkdirSync(join(process.cwd()), { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ featureX: false, maxUsers: 10 }));
}

export let config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));

export const configWatcher =
  process.env.MITII_NO_LISTEN === "1"
    ? null
    : fs.watch(CONFIG_PATH, () => {
        try {
          config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
        } catch {
          /* ignore parse errors */
        }
      });

const app = express();
app.get("/config", (_req, res) => res.json(config));

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close(cb) { cb?.(); }, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server, CONFIG_PATH };
