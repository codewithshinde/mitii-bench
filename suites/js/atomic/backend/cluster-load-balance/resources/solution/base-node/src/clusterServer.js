import cluster from "node:cluster";
import http from "node:http";
import os from "node:os";

export function workerCount() {
  return os.cpus().length;
}

export function forkWorkers(onMessage, clusterModule = cluster) {
  if (!clusterModule.isPrimary) return [];
  const workers = [];
  for (let i = 0; i < workerCount(); i++) {
    const worker = clusterModule.fork();
    onMessage?.(worker);
    workers.push(worker);
  }
  return workers;
}

export function startClusterServer(port = Number(process.env.PORT || 3000)) {
  if (cluster.isPrimary) {
    forkWorkers();
    return null;
  }

  const server = http.createServer((_req, res) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ pid: process.pid, worker: true }));
  });
  if (process.env.MITII_NO_LISTEN !== "1") {
    server.listen(port);
  }
  return server;
}
