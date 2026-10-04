export function setupGracefulShutdown(server, options = {}) {
  const timers = new Set();
  let shuttingDown = false;

  function registerTimer(timer) {
    timers.add(timer);
    timer.unref?.();
    return timer;
  }

  async function shutdown(signal) {
    if (shuttingDown) return shuttingDown;
    shuttingDown = true;
    await new Promise((resolve) => {
      if (!server?.close) return resolve();
      server.close(() => resolve());
    });
    for (const timer of timers) clearTimeout(timer);
    await options.onShutdown?.(signal);
    if (options.exitFn) options.exitFn(0);
    return shuttingDown;
  }

  const onSigint = () => shutdown("SIGINT");
  const onSigterm = () => shutdown("SIGTERM");
  process.on("SIGINT", onSigint);
  process.on("SIGTERM", onSigterm);

  return {
    registerTimer,
    shutdown,
    isShuttingDown: () => shuttingDown,
    dispose() {
      process.off("SIGINT", onSigint);
      process.off("SIGTERM", onSigterm);
    },
  };
}
