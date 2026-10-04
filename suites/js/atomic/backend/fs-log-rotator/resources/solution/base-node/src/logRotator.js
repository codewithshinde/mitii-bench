import { appendFile, rename, stat } from "node:fs/promises";

const MAX_BYTES = 1024 * 1024;

export async function appendLog(filename, message) {
  const line = `${new Date().toISOString()} ${String(message)}\n`;
  try {
    const info = await stat(filename);
    if (info.size >= MAX_BYTES) {
      await rename(filename, `${filename}.old`);
    }
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
  await appendFile(filename, line, "utf8");
}
