import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

export const requestStore = new AsyncLocalStorage();

export function requestIdMiddleware(req, res, next) {
  const incoming = req.headers["x-request-id"];
  const requestId = typeof incoming === "string" && incoming ? incoming : randomUUID();
  res.setHeader("x-request-id", requestId);
  requestStore.run({ requestId }, () => next?.());
}

export function logWithContext(message) {
  const store = requestStore.getStore();
  return {
    requestId: store?.requestId ?? "unknown",
    message: String(message),
  };
}
