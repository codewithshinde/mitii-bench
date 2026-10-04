import { Transform } from "node:stream";

export function createCsvToJsonlTransform() {
  /** @type {string[] | null} */
  let header = null;
  let leftover = "";

  return new Transform({
    transform(chunk, _enc, cb) {
      leftover += chunk.toString("utf8");
      const lines = leftover.split("\n");
      leftover = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        if (!header) {
          header = line.split(",").map((h) => h.trim());
          continue;
        }
        const values = line.split(",").map((v) => v.trim());
        const row = {};
        header.forEach((key, i) => {
          row[key] = values[i] ?? "";
        });
        this.push(JSON.stringify(row) + "\n");
      }
      cb();
    },
    flush(cb) {
      if (header && leftover.trim()) {
        const values = leftover.split(",").map((v) => v.trim());
        const row = {};
        header.forEach((key, i) => {
          row[key] = values[i] ?? "";
        });
        this.push(JSON.stringify(row) + "\n");
      }
      cb();
    },
  });
}
