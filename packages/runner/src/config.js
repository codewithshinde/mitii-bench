import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DEFAULTS = {
  mitiiBin: null,
  timeoutSec: 300,
  keepWorkspaces: false,
  env: {},
};

export function loadConfig(root) {
  const candidates = [
    join(root, "runner.config.json"),
    join(root, "runner.config.local.json"),
  ];
  let file = { ...DEFAULTS };
  for (const path of candidates) {
    if (!existsSync(path)) continue;
    try {
      file = { ...file, ...JSON.parse(readFileSync(path, "utf8")) };
    } catch {
      // ignore bad config
    }
  }
  if (process.env.MITII_BIN) file.mitiiBin = process.env.MITII_BIN;
  return file;
}
