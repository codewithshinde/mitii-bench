import { performance } from "node:perf_hooks";

export async function measureExecutionTime(fn) {
  const start = performance.now();
  const result = await fn();
  const durationMs = performance.now() - start;
  return { result, durationMs };
}
