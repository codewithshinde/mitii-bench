function write(stream, level, args) {
  const message = args
    .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
    .join(" ");
  stream.write(
    JSON.stringify({
      severity: level,
      timestamp: new Date().toISOString(),
      message,
    }) + "\n",
  );
}

export const logger = {
  info: (...args) => write(process.stdout, "info", args),
  error: (...args) => write(process.stderr, "error", args),
  warn: (...args) => write(process.stdout, "warn", args),
};
