import v8 from "node:v8";

export function checkHeapLimits(threshold = 0.85) {
  const stats = v8.getHeapStatistics();
  const usageRatio = stats.used_heap_size / stats.heap_size_limit;
  const exceeded = usageRatio > threshold;
  return {
    usedHeapSize: stats.used_heap_size,
    heapSizeLimit: stats.heap_size_limit,
    usageRatio,
    exceeded,
    warning: exceeded
      ? `Heap usage ${(usageRatio * 100).toFixed(1)}% exceeds ${threshold * 100}% threshold`
      : null,
  };
}
