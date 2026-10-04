import http from "node:http";
import { Worker } from "node:worker_threads";

export function fibonacciInWorker(n) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./fibWorker.js", import.meta.url), {
      workerData: { n: Number(n) },
    });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`worker exited ${code}`));
    });
  });
}

export const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (req.method === "GET" && url.pathname === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }
  if (req.method === "GET" && url.pathname === "/calculate-fibonacci") {
    const n = Number(url.searchParams.get("n") ?? "10");
    const result = await fibonacciInWorker(n);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ n, result }));
    return;
  }
  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "not found" }));
});

const port = Number(process.env.PORT || 0);
if (process.env.MITII_NO_LISTEN !== "1") {
  server.listen(port);
}
