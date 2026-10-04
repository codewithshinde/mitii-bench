import os from "node:os";

export function getSystemStats() {
  const total = os.totalmem();
  const free = os.freemem();
  const usedPct = total === 0 ? 0 : ((total - free) / total) * 100;
  return {
    memoryUsagePercent: Number(usedPct.toFixed(2)),
    loadAverage: os.loadavg(),
    uptime: process.uptime(),
  };
}
