import express from "express";
import archiver from "archiver";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const FILES_DIR = join(process.cwd(), "files");
if (!existsSync(FILES_DIR)) {
  mkdirSync(FILES_DIR, { recursive: true });
  writeFileSync(join(FILES_DIR, "a.txt"), "alpha");
  writeFileSync(join(FILES_DIR, "b.txt"), "beta");
}

const app = express();
app.use(express.json());

app.post("/api/files/download-zip", (req, res) => {
  const names = req.body?.files ?? ["a.txt", "b.txt"];
  res.setHeader("content-type", "application/zip");
  res.setHeader("content-disposition", 'attachment; filename="bundle.zip"');
  const archive = archiver("zip");
  archive.on("error", (err) => res.status(500).end(String(err)));
  archive.pipe(res);
  for (const name of names) archive.file(join(FILES_DIR, name), { name });
  archive.finalize();
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server };
