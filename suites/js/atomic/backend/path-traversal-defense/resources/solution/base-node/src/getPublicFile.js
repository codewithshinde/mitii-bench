import { readFile } from "node:fs/promises";
import { join, normalize, resolve, sep } from "node:path";

const PUBLIC_ROOT = resolve(process.cwd(), "src", "public");

export async function getPublicFile(userPath) {
  const cleaned = String(userPath ?? "").replace(/^[/\\]+/, "");
  const candidate = normalize(join(PUBLIC_ROOT, cleaned));
  const rootWithSep = PUBLIC_ROOT.endsWith(sep) ? PUBLIC_ROOT : PUBLIC_ROOT + sep;
  if (candidate !== PUBLIC_ROOT && !candidate.startsWith(rootWithSep)) {
    const err = new Error("Path traversal denied");
    err.code = "EACCES";
    throw err;
  }
  return readFile(candidate);
}
