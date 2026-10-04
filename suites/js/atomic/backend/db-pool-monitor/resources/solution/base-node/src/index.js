class FakePool {
  constructor() {
    this.activeConnections = 2;
    this.idleConnections = 3;
    this.queuedRequests = 0;
  }
  snapshot() {
    return {
      activeConnections: this.activeConnections,
      idleConnections: this.idleConnections,
      queuedRequests: this.queuedRequests,
    };
  }
}

export const pool = new FakePool();
export const alerts = [];

export function monitorPool({ starvationThreshold = 5 } = {}) {
  const s = pool.snapshot();
  if (s.queuedRequests >= starvationThreshold) {
    alerts.push({ type: "pool-starvation", at: Date.now(), ...s });
  }
  return s;
}

export function setPoolState(partial) {
  Object.assign(pool, partial);
}
