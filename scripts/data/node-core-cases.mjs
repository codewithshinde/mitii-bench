/**
 * Node core backend cases (prompts 1–25) from references/node-tasks.md.
 * Consumed by suite generators and dry-run tooling.
 */
export const nodeCoreCases = [
  {
    n: 1,
    slug: "http-native-server",
    title: "HTTP Server without Frameworks",
    difficulty: "easy",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/index.js",
    markers: ["createServer","/health","/echo"],
    files: {
      "src/index.js": `import http from "node:http";

const started = Date.now();

export const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (req.method === "GET" && url.pathname === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        uptime: (Date.now() - started) / 1000,
      }),
    );
    return;
  }
  if (req.method === "POST" && url.pathname === "/echo") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString("utf8");
    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      payload = body;
    }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(payload));
    return;
  }
  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "not found" }));
});

const port = Number(process.env.PORT || 0);
if (process.env.MITII_NO_LISTEN !== "1") {
  server.listen(port, () => {
    const address = server.address();
    if (address && typeof address === "object") {
      console.log(\`listening on \${address.port}\`);
    }
  });
}
`,
    },
    oracle: `import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

describe("http-native-server", () => {
  /** @type {import("node:http").Server} */
  let listening;

  before(async () => {
    process.env.MITII_NO_LISTEN = "1";
    const mod = await import("../src/index.js");
    listening = await new Promise((resolve, reject) => {
      mod.server.listen(0, "127.0.0.1", () => resolve(mod.server));
      mod.server.once("error", reject);
    });
  });

  after(async () => {
    await new Promise((resolve) => listening.close(resolve));
  });

  function request(method, path, body) {
    const address = listening.address();
    const port = typeof address === "object" && address ? address.port : 0;
    return new Promise((resolve, reject) => {
      const req = http.request(
        { hostname: "127.0.0.1", port, path, method, headers: body ? { "content-type": "application/json" } : {} },
        (res) => {
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8") }));
        },
      );
      req.on("error", reject);
      if (body) req.end(JSON.stringify(body));
      else req.end();
    });
  }

  it("GET /health returns ok status and uptime", async () => {
    const res = await request("GET", "/health");
    assert.equal(res.status, 200);
    const json = JSON.parse(res.body);
    assert.equal(json.status, "ok");
    assert.equal(typeof json.uptime, "number");
  });

  it("POST /echo returns parsed JSON body", async () => {
    const res = await request("POST", "/echo", { hello: "world" });
    assert.equal(res.status, 200);
    assert.deepEqual(JSON.parse(res.body), { hello: "world" });
  });

  it("returns 404 for unknown routes", async () => {
    const res = await request("GET", "/missing");
    assert.equal(res.status, 404);
  });
});
`,
    http: {"start":{"command":"node src/index.js"},"timeoutMs":15000,"requests":[{"method":"GET","path":"/health","expect":{"status":200,"jsonPaths":["status","uptime"],"jsonSubset":{"status":"ok"}}},{"method":"POST","path":"/echo","json":{"hello":"world"},"expect":{"status":200,"jsonSubset":{"hello":"world"}}}]},
    smoke: true,
  },
  {
    n: 2,
    slug: "child-process-diagnostics",
    title: "Event Loop & Process Execution (Child Process)",
    difficulty: "medium",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/diagnostics.js",
    markers: ["exec","runSystemDiagnostics","Timeout"],
    files: {
      "src/diagnostics.js": `import { exec } from "node:child_process";

export function runSystemDiagnostics(command) {
  const cmd =
    command ??
    (process.platform === "win32" ? "cmd /c echo diagnostics-ok" : "echo diagnostics-ok");
  return new Promise((resolve, reject) => {
    const child = exec(cmd, (error, stdout, stderr) => {
      clearTimeout(timer);
      resolve({
        stdout: stdout ?? "",
        stderr: stderr ?? "",
        exitCode: error && typeof error.code === "number" ? error.code : 0,
      });
    });
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("Timeout"));
    }, 5000);
  });
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { runSystemDiagnostics } from "../src/diagnostics.js";

describe("runSystemDiagnostics", () => {
  it("returns stdout and exitCode for a quick command", async () => {
    const result = await runSystemDiagnostics();
    assert.match(result.stdout.trim(), /diagnostics-ok/);
    assert.equal(result.exitCode, 0);
  });

  it("rejects when the command exceeds 5 seconds", async () => {
    const hang =
      process.platform === "win32"
        ? "cmd /c ping -n 6 127.0.0.1 > nul"
        : "sleep 6";
    await assert.rejects(() => runSystemDiagnostics(hang), /Timeout/);
  });
});
`,
    http: null,
    smoke: false,
  },
  {
    n: 3,
    slug: "fs-log-rotator",
    title: "Native File System (fs/promises) Log Rotator",
    difficulty: "medium",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/logRotator.js",
    markers: ["appendLog",".old","stat"],
    files: {
      "src/logRotator.js": `import { appendFile, rename, stat } from "node:fs/promises";

const MAX_BYTES = 1024 * 1024;

export async function appendLog(filename, message) {
  const line = \`\${new Date().toISOString()} \${String(message)}\\n\`;
  try {
    const info = await stat(filename);
    if (info.size >= MAX_BYTES) {
      await rename(filename, \`\${filename}.old\`);
    }
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
  await appendFile(filename, line, "utf8");
}
`,
    },
    oracle: `import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { appendLog } from "../src/logRotator.js";

describe("appendLog", () => {
  /** @type {string} */
  let dir;

  before(async () => {
    dir = await mkdtemp(join(tmpdir(), "log-rotator-"));
  });

  after(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("appends timestamped lines", async () => {
    const file = join(dir, "app.log");
    await appendLog(file, "hello");
    const text = await readFile(file, "utf8");
    assert.match(text, /^\\d{4}-\\d{2}-\\d{2}T.* hello\\n$/);
  });

  it("rotates to .old when file exceeds 1MB", async () => {
    const file = join(dir, "big.log");
    await writeFile(file, "x".repeat(1024 * 1024));
    await appendLog(file, "trigger");
    const old = await readFile(\`\${file}.old\`, "utf8");
    const current = await readFile(file, "utf8");
    assert.equal(old.length, 1024 * 1024);
    assert.match(current, /trigger\\n$/);
  });
});
`,
    http: null,
    smoke: false,
  },
  {
    n: 4,
    slug: "eventemitter-order-pipeline",
    title: "Custom EventEmitter Pipeline",
    difficulty: "medium",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/orderPipeline.js",
    markers: ["EventEmitter","order:created","order:paid","order:shipped"],
    files: {
      "src/orderPipeline.js": `import { EventEmitter } from "node:events";

/** @type {{ step: string; orderId: string; email: string }[]} */
const sent = [];

export function getSentNotifications() {
  return [...sent];
}

export function resetSentNotifications() {
  sent.length = 0;
}

function notify(step, order) {
  sent.push({ step, orderId: order.id, email: order.email });
}

export class OrderPipeline extends EventEmitter {
  constructor() {
    super();
    this.on("order:created", (order) => notify("created", order));
    this.on("order:paid", (order) => notify("paid", order));
    this.on("order:shipped", (order) => notify("shipped", order));
  }

  advance(order, step) {
    this.emit(\`order:\${step}\`, order);
  }
}
`,
    },
    oracle: `import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { OrderPipeline, getSentNotifications, resetSentNotifications } from "../src/orderPipeline.js";

describe("OrderPipeline", () => {
  beforeEach(() => resetSentNotifications());

  it("sends mock emails for each lifecycle step", () => {
    const pipeline = new OrderPipeline();
    const order = { id: "o1", email: "ada@example.com" };
    pipeline.advance(order, "created");
    pipeline.advance(order, "paid");
    pipeline.advance(order, "shipped");
    assert.deepEqual(getSentNotifications(), [
      { step: "created", orderId: "o1", email: "ada@example.com" },
      { step: "paid", orderId: "o1", email: "ada@example.com" },
      { step: "shipped", orderId: "o1", email: "ada@example.com" },
    ]);
  });

  it("does not notify for steps that were never emitted", () => {
    const pipeline = new OrderPipeline();
    pipeline.advance({ id: "o2", email: "b@example.com" }, "created");
    assert.equal(getSentNotifications().length, 1);
  });
});
`,
    http: null,
    smoke: false,
  },
  {
    n: 5,
    slug: "stream-csv-to-jsonl",
    title: "Stream Parsing & Memory Efficiency",
    difficulty: "hard",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/csvTransform.js",
    markers: ["Transform","jsonl"],
    files: {
      "src/csvTransform.js": `import { Transform } from "node:stream";

export function createCsvToJsonlTransform() {
  /** @type {string[] | null} */
  let header = null;
  let leftover = "";

  return new Transform({
    transform(chunk, _enc, cb) {
      leftover += chunk.toString("utf8");
      const lines = leftover.split("\\n");
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
        this.push(JSON.stringify(row) + "\\n");
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
        this.push(JSON.stringify(row) + "\\n");
      }
      cb();
    },
  });
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { createCsvToJsonlTransform } from "../src/csvTransform.js";

function collect(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (c) => chunks.push(c));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

describe("createCsvToJsonlTransform", () => {
  it("converts CSV rows to jsonl without loading entire file", async () => {
    const csv = "id,name\\n1,Ada\\n2,Bob\\n";
    const out = await collect(Readable.from([csv]).pipe(createCsvToJsonlTransform()));
    const lines = out.trim().split("\\n");
    assert.equal(lines.length, 2);
    assert.deepEqual(JSON.parse(lines[0]), { id: "1", name: "Ada" });
    assert.deepEqual(JSON.parse(lines[1]), { id: "2", name: "Bob" });
  });

  it("ignores blank lines", async () => {
    const csv = "a\\n\\n1\\n";
    const out = await collect(Readable.from([csv]).pipe(createCsvToJsonlTransform()));
    assert.equal(out.trim().split("\\n").length, 1);
  });
});
`,
    http: null,
    smoke: false,
  },
  {
    n: 6,
    slug: "buffer-file-type",
    title: "Buffer Manipulation & Binary Data",
    difficulty: "easy",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/detectFileType.js",
    markers: ["detectFileType","Buffer"],
    files: {
      "src/detectFileType.js": `/**
 * Detect common image/file types from magic bytes.
 * @param {Buffer} buffer
 * @returns {string} extension without leading dot, or "unknown"
 */
export function detectFileType(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) return "unknown";
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return "png";
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return "gif";
  }
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return "pdf";
  }
  return "unknown";
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { detectFileType } from "../src/detectFileType.js";

describe("detectFileType", () => {
  it("detects PNG", () => {
    assert.equal(detectFileType(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d])), "png");
  });
  it("detects JPEG", () => {
    assert.equal(detectFileType(Buffer.from([0xff, 0xd8, 0xff, 0xe0])), "jpg");
  });
  it("returns unknown for short buffers", () => {
    assert.equal(detectFileType(Buffer.from([1, 2])), "unknown");
  });
});
`,
    http: null,
    smoke: true,
  },
  {
    n: 7,
    slug: "crypto-scrypt-password",
    title: "Crypto Module (Password Hashing)",
    difficulty: "easy",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/passwordHash.js",
    markers: ["scrypt","hashPassword","salt"],
    files: {
      "src/passwordHash.js": `import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = /** @type {Buffer} */ (await scryptAsync(password, salt, 64));
  return \`\${salt}:\${derived.toString("hex")}\`;
}

export async function verifyPassword(password, stored) {
  const [salt, keyHex] = String(stored).split(":");
  if (!salt || !keyHex) return false;
  const derived = /** @type {Buffer} */ (await scryptAsync(password, salt, 64));
  const key = Buffer.from(keyHex, "hex");
  if (key.length !== derived.length) return false;
  return timingSafeEqual(key, derived);
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../src/passwordHash.js";

describe("hashPassword", () => {
  it("returns salt:derivedKey hex", async () => {
    const hashed = await hashPassword("secret");
    assert.match(hashed, /^[0-9a-f]+:[0-9a-f]+$/);
  });
  it("verifies same password and rejects wrong", async () => {
    const hashed = await hashPassword("secret");
    assert.equal(await verifyPassword("secret", hashed), true);
    assert.equal(await verifyPassword("nope", hashed), false);
  });
  it("uses different salts", async () => {
    const a = await hashPassword("secret");
    const b = await hashPassword("secret");
    assert.notEqual(a, b);
  });
});
`,
    http: null,
    smoke: true,
  },
  {
    n: 8,
    slug: "worker-fibonacci",
    title: "Worker Threads for Heavy Computation",
    difficulty: "hard",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/index.js",
    markers: ["Worker","fibonacci","worker_threads"],
    files: {
      "src/fibWorker.js": `import { parentPort, workerData } from "node:worker_threads";

function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

parentPort.postMessage(fib(Number(workerData.n)));
`,
      "src/index.js": `import http from "node:http";
import { Worker } from "node:worker_threads";

export function fibonacciInWorker(n) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./fibWorker.js", import.meta.url), {
      workerData: { n: Number(n) },
    });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(\`worker exited \${code}\`));
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
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fibonacciInWorker } from "../src/index.js";

describe("fibonacciInWorker", () => {
  it("computes fibonacci in a worker thread", async () => {
    assert.equal(await fibonacciInWorker(10), 55);
  });

  it("handles base cases", async () => {
    assert.equal(await fibonacciInWorker(0), 0);
    assert.equal(await fibonacciInWorker(1), 1);
  });
});
`,
    http: {"start":{"command":"node src/index.js"},"timeoutMs":15000,"requests":[{"method":"GET","path":"/health","expect":{"status":200,"jsonSubset":{"status":"ok"}}},{"method":"GET","path":"/calculate-fibonacci?n=10","expect":{"status":200,"jsonSubset":{"n":10,"result":55}}}]},
    smoke: false,
  },
  {
    n: 9,
    slug: "async-local-storage-request-id",
    title: "Asynchronous Context Tracking (`AsyncLocalStorage`)",
    difficulty: "hard",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/requestContext.js",
    markers: ["AsyncLocalStorage","x-request-id"],
    files: {
      "src/requestContext.js": `import { AsyncLocalStorage } from "node:async_hooks";
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
`,
      "src/index.js": `import http from "node:http";
import { requestIdMiddleware, logWithContext } from "./requestContext.js";

export const server = http.createServer((req, res) => {
  requestIdMiddleware(req, res, () => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (req.method === "GET" && url.pathname === "/context") {
      const entry = logWithContext("handled request");
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(entry));
      return;
    }
    res.writeHead(404);
    res.end();
  });
});

const port = Number(process.env.PORT || 0);
if (process.env.MITII_NO_LISTEN !== "1") {
  server.listen(port);
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { requestIdMiddleware, logWithContext } from "../src/requestContext.js";

describe("request context", () => {
  it("propagates x-request-id through async local storage", () => {
    const req = { headers: { "x-request-id": "req-123" } };
    const res = { setHeader() {} };
    requestIdMiddleware(req, res, () => {
      const entry = logWithContext("deep log");
      assert.equal(entry.requestId, "req-123");
      assert.equal(entry.message, "deep log");
    });
  });

  it("generates an id when header is missing", () => {
    const req = { headers: {} };
    const res = { setHeader() {} };
    requestIdMiddleware(req, res, () => {
      const entry = logWithContext("auto");
      assert.notEqual(entry.requestId, "unknown");
    });
  });
});
`,
    http: {"start":{"command":"node src/index.js"},"timeoutMs":15000,"requests":[{"method":"GET","path":"/context","headers":{"x-request-id":"test-req-1"},"expect":{"status":200,"jsonSubset":{"requestId":"test-req-1","message":"handled request"},"headers":{"x-request-id":"test-req-1"}}}]},
    smoke: false,
  },
  {
    n: 10,
    slug: "path-traversal-defense",
    title: "Path Normalization & Directory Traversal Defense",
    difficulty: "easy",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/getPublicFile.js",
    markers: ["getPublicFile","normalize","public"],
    files: {
      "src/getPublicFile.js": `import { readFile } from "node:fs/promises";
import { join, normalize, resolve, sep } from "node:path";

const PUBLIC_ROOT = resolve(process.cwd(), "src", "public");

export async function getPublicFile(userPath) {
  const cleaned = String(userPath ?? "").replace(/^[/\\\\]+/, "");
  const candidate = normalize(join(PUBLIC_ROOT, cleaned));
  const rootWithSep = PUBLIC_ROOT.endsWith(sep) ? PUBLIC_ROOT : PUBLIC_ROOT + sep;
  if (candidate !== PUBLIC_ROOT && !candidate.startsWith(rootWithSep)) {
    const err = new Error("Path traversal denied");
    err.code = "EACCES";
    throw err;
  }
  return readFile(candidate);
}
`,
    },
    oracle: `import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getPublicFile } from "../src/getPublicFile.js";

describe("getPublicFile", () => {
  before(async () => {
    await mkdir(join(process.cwd(), "src", "public"), { recursive: true });
    await writeFile(join(process.cwd(), "src", "public", "a.txt"), "hello");
  });

  it("reads files inside public", async () => {
    const buf = await getPublicFile("a.txt");
    assert.equal(buf.toString("utf8"), "hello");
  });

  it("rejects traversal", async () => {
    await assert.rejects(() => getPublicFile("../package.json"), (err) => err.code === "EACCES");
    await assert.rejects(() => getPublicFile("../../secret.txt"), (err) => err.code === "EACCES");
  });
});
`,
    http: null,
    smoke: true,
  },
  {
    n: 11,
    slug: "dual-package-exports",
    title: "Module System Interop (CJS & ESM)",
    difficulty: "hard",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "package.json",
    markers: ["formatCurrency","exports"],
    files: {
      "package.json": `{
  "name": "dual-package-demo",
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/formatCurrency.js",
      "require": "./formatCurrency.cjs"
    }
  }
}
`,
      "src/formatCurrency.js": `export function formatCurrency(val) {
  const n = Number(val);
  if (!Number.isFinite(n)) return "$0.00";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}
`,
      "formatCurrency.cjs": `function formatCurrency(val) {
  const n = Number(val);
  if (!Number.isFinite(n)) return "$0.00";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

module.exports = { formatCurrency };
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { formatCurrency } from "../src/formatCurrency.js";

describe("formatCurrency dual package", () => {
  it("formats USD values", () => {
    assert.equal(formatCurrency(12.5), "$12.50");
    assert.equal(formatCurrency("nope"), "$0.00");
  });

  it("declares import and require export conditions", () => {
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    assert.equal(pkg.exports["."].import, "./src/formatCurrency.js");
    assert.equal(pkg.exports["."].require, "./formatCurrency.cjs");
  });
});
`,
    http: null,
    smoke: false,
  },
  {
    n: 12,
    slug: "readline-env-wizard",
    title: "Readline CLI Tool",
    difficulty: "medium",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/envWizard.js",
    markers: ["readline",".env"],
    files: {
      "src/envWizard.js": `import { createInterface } from "node:readline/promises";
import { writeFile } from "node:fs/promises";

export async function writeEnvFile({ host, port, user }, outputPath = ".env") {
  const body = [
    \`DATABASE_HOST=\${host}\`,
    \`DATABASE_PORT=\${port}\`,
    \`DATABASE_USER=\${user}\`,
    "",
  ].join("\\n");
  await writeFile(outputPath, body, "utf8");
  return body;
}

export async function runInteractiveEnvWizard(input, output, outputPath = ".env") {
  const rl = createInterface({ input, output });
  try {
    const host = await rl.question("Database Host: ");
    const port = await rl.question("Database Port: ");
    const user = await rl.question("Database User: ");
    const confirm = await rl.question("Write .env? (y/N): ");
    if (String(confirm).trim().toLowerCase() !== "y") {
      return null;
    }
    return writeEnvFile({ host, port, user }, outputPath);
  } finally {
    rl.close();
  }
}
`,
    },
    oracle: `import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Readable } from "node:stream";
import { writeEnvFile, runInteractiveEnvWizard } from "../src/envWizard.js";

describe("env wizard", () => {
  /** @type {string} */
  let dir;

  before(async () => {
    dir = await mkdtemp(join(tmpdir(), "env-wizard-"));
  });

  after(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("writes parsed answers to .env", async () => {
    const path = join(dir, ".env");
    const body = await writeEnvFile({ host: "db.local", port: "5432", user: "app" }, path);
    assert.match(body, /DATABASE_HOST=db.local/);
    assert.equal(await readFile(path, "utf8"), body);
  });

  it("skips writing when user declines confirmation", async () => {
    const path = join(dir, "skip.env");
    const script = ["db.local", "5432", "app", "n", ""].join("\\n");
    const result = await runInteractiveEnvWizard(Readable.from([script]), null, path);
    assert.equal(result, null);
    await assert.rejects(() => readFile(path, "utf8"));
  });
});
`,
    http: null,
    smoke: false,
  },
  {
    n: 13,
    slug: "url-sanitize-redirect",
    title: "URL Parsing & Query Building",
    difficulty: "easy",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/sanitizeRedirectUrl.js",
    markers: ["sanitizeRedirectUrl","utm_source","URL"],
    files: {
      "src/sanitizeRedirectUrl.js": `const ALLOWED_HOSTS = new Set(["example.com", "www.example.com", "app.example.com"]);
const STRIP_PARAMS = new Set(["utm_source", "utm_medium", "utm_campaign", "fbclid", "gclid"]);

export function sanitizeRedirectUrl(rawUrl) {
  let url;
  try {
    url = new URL(String(rawUrl));
  } catch {
    throw new Error("Invalid URL");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Unsupported protocol");
  }
  if (!ALLOWED_HOSTS.has(url.hostname)) {
    throw new Error("Host not allowed");
  }
  for (const key of [...url.searchParams.keys()]) {
    if (STRIP_PARAMS.has(key)) url.searchParams.delete(key);
  }
  return url.toString();
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { sanitizeRedirectUrl } from "../src/sanitizeRedirectUrl.js";

describe("sanitizeRedirectUrl", () => {
  it("keeps whitelisted hosts and strips tracking params", () => {
    const out = sanitizeRedirectUrl("https://example.com/path?utm_source=x&ok=1&fbclid=y");
    assert.equal(out, "https://example.com/path?ok=1");
  });

  it("rejects unknown hosts", () => {
    assert.throws(() => sanitizeRedirectUrl("https://evil.com/"), /Host not allowed/);
  });

  it("rejects invalid URLs", () => {
    assert.throws(() => sanitizeRedirectUrl("not-a-url"), /Invalid URL/);
  });
});
`,
    http: null,
    smoke: true,
  },
  {
    n: 14,
    slug: "fetch-with-timeout",
    title: "AbortController for Async Operations",
    difficulty: "medium",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/fetchWithTimeout.js",
    markers: ["fetchWithTimeout","AbortController","TimeoutError"],
    files: {
      "src/fetchWithTimeout.js": `export class TimeoutError extends Error {
  constructor(message = "Request timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

export async function fetchWithTimeout(url, timeoutMs = 5000, fetchImpl = globalThis.fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(url, { signal: controller.signal });
  } catch (err) {
    if (err && typeof err === "object" && err.name === "AbortError") {
      throw new TimeoutError();
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fetchWithTimeout, TimeoutError } from "../src/fetchWithTimeout.js";

describe("fetchWithTimeout", () => {
  it("returns the response when fetch resolves quickly", async () => {
    const mock = async () => ({ ok: true, status: 200 });
    const res = await fetchWithTimeout("https://example.com", 1000, mock);
    assert.equal(res.status, 200);
  });

  it("rejects with TimeoutError when fetch is aborted", async () => {
    const mock = (_url, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener("abort", () => {
          const err = new Error("aborted");
          err.name = "AbortError";
          reject(err);
        });
      });
    await assert.rejects(
      () => fetchWithTimeout("https://slow.example", 20, mock),
      (err) => err instanceof TimeoutError,
    );
  });
});
`,
    http: null,
    smoke: true,
  },
  {
    n: 15,
    slug: "global-error-handlers",
    title: "Global Error Handling",
    difficulty: "medium",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/crashGuard.js",
    markers: ["uncaughtException","unhandledRejection"],
    files: {
      "src/crashGuard.js": `import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

let installed = false;

export function installCrashGuard(logPath = "logs/crash.log", options = {}) {
  if (installed) return { installed: false };
  installed = true;
  const exitFn = options.exitFn ?? (() => process.exit(1));

  async function logAndExit(kind, error) {
    await mkdir(dirname(logPath), { recursive: true });
    const payload = {
      kind,
      message: error?.message ?? String(error),
      timestamp: new Date().toISOString(),
    };
    await appendFile(logPath, JSON.stringify(payload) + "\\n", "utf8");
    exitFn(1);
  }

  process.on("uncaughtException", (err) => {
    logAndExit("uncaughtException", err).catch(() => exitFn(1));
  });
  process.on("unhandledRejection", (reason) => {
    logAndExit("unhandledRejection", reason).catch(() => exitFn(1));
  });

  return { installed: true, logPath };
}
`,
    },
    oracle: `import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { installCrashGuard } from "../src/crashGuard.js";

describe("installCrashGuard", () => {
  /** @type {string} */
  let dir;

  before(async () => {
    dir = await mkdtemp(join(tmpdir(), "crash-guard-"));
  });

  after(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("registers process listeners and returns config", () => {
    const beforeCount = process.listenerCount("uncaughtException");
    const logPath = join(dir, "crash.log");
    const result = installCrashGuard(logPath, { exitFn() {} });
    assert.equal(result.installed, true);
    assert.equal(result.logPath, logPath);
    assert.ok(process.listenerCount("uncaughtException") >= beforeCount + 1);
    assert.ok(process.listenerCount("unhandledRejection") >= 1);
  });

  it("writes structured JSON when unhandledRejection fires", async () => {
    const logPath = join(dir, "reject.log");
    installCrashGuard(logPath, { exitFn() {} });
    process.emit("unhandledRejection", new Error("boom"));
    await new Promise((r) => setTimeout(r, 50));
    const lines = (await readFile(logPath, "utf8")).trim().split("\\n");
    const last = JSON.parse(lines.at(-1));
    assert.equal(last.kind, "unhandledRejection");
    assert.match(last.message, /boom/);
  });
});
`,
    http: null,
    smoke: false,
  },
  {
    n: 16,
    slug: "cluster-load-balance",
    title: "Cluster Module Load Balancing",
    difficulty: "hard",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/clusterServer.js",
    markers: ["cluster","fork"],
    files: {
      "src/clusterServer.js": `import cluster from "node:cluster";
import http from "node:http";
import os from "node:os";

export function workerCount() {
  return os.cpus().length;
}

export function forkWorkers(onMessage) {
  if (!cluster.isPrimary) return [];
  const workers = [];
  for (let i = 0; i < workerCount(); i++) {
    const worker = cluster.fork();
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
  server.listen(port);
  return server;
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import { workerCount, forkWorkers } from "../src/clusterServer.js";

describe("clusterServer helpers", () => {
  it("uses cpu count for worker sizing", () => {
    assert.equal(workerCount(), os.cpus().length);
  });

  it("returns an array from forkWorkers in worker context", () => {
    const workers = forkWorkers();
    assert.ok(Array.isArray(workers));
  });
});
`,
    http: null,
    smoke: false,
  },
  {
    n: 17,
    slug: "zlib-gzip-middleware",
    title: "Zlib Compression Stream",
    difficulty: "medium",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/gzipMiddleware.js",
    markers: ["createGzip","Accept-Encoding"],
    files: {
      "src/gzipMiddleware.js": `import zlib from "node:zlib";

export function shouldCompress(req) {
  const accept = String(req.headers["accept-encoding"] ?? "");
  return accept.includes("gzip");
}

export function sendMaybeCompressed(req, res, body, contentType = "application/json") {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  if (!shouldCompress(req)) {
    res.writeHead(200, { "content-type": contentType });
    res.end(payload);
    return;
  }
  zlib.gzip(Buffer.from(payload), (err, compressed) => {
    if (err) {
      res.writeHead(500);
      res.end("compression failed");
      return;
    }
    res.writeHead(200, {
      "content-type": contentType,
      "content-encoding": "gzip",
    });
    res.end(compressed);
  });
}
`,
      "src/index.js": `import http from "node:http";
import { sendMaybeCompressed } from "./gzipMiddleware.js";

export const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (req.method === "GET" && url.pathname === "/data") {
    sendMaybeCompressed(req, res, { message: "hello" });
    return;
  }
  res.writeHead(404);
  res.end();
});

const port = Number(process.env.PORT || 0);
if (process.env.MITII_NO_LISTEN !== "1") {
  server.listen(port);
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { shouldCompress } from "../src/gzipMiddleware.js";

describe("gzip middleware", () => {
  it("detects gzip accept encoding", () => {
    assert.equal(shouldCompress({ headers: { "accept-encoding": "gzip, deflate" } }), true);
    assert.equal(shouldCompress({ headers: { "accept-encoding": "identity" } }), false);
  });

  it("handles missing accept-encoding header", () => {
    assert.equal(shouldCompress({ headers: {} }), false);
  });
});
`,
    http: {"start":{"command":"node src/index.js"},"timeoutMs":15000,"requests":[{"method":"GET","path":"/data","headers":{"Accept-Encoding":"gzip"},"expect":{"status":200,"headerContains":{"content-encoding":"gzip"}}},{"method":"GET","path":"/data","expect":{"status":200,"jsonSubset":{"message":"hello"}}}]},
    smoke: false,
  },
  {
    n: 18,
    slug: "dns-inspect-domain",
    title: "DNS Lookup Module",
    difficulty: "medium",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/inspectDomain.js",
    markers: ["inspectDomain","resolve4","resolveMx"],
    files: {
      "src/inspectDomain.js": `import dns from "node:dns/promises";

const defaultResolver = {
  resolve4: (domain) => dns.resolve4(domain),
  resolveMx: (domain) => dns.resolveMx(domain),
  resolveTxt: (domain) => dns.resolveTxt(domain),
};

export async function inspectDomain(domain, resolver = defaultResolver) {
  const [a, mx, txt] = await Promise.all([
    resolver.resolve4(domain).catch(() => []),
    resolver.resolveMx(domain).catch(() => []),
    resolver.resolveTxt(domain).catch(() => []),
  ]);
  return {
    domain,
    a,
    mx: mx.map((record) => ({ exchange: record.exchange, priority: record.priority })),
    txt: txt.map((chunks) => chunks.join("")),
  };
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { inspectDomain } from "../src/inspectDomain.js";

describe("inspectDomain", () => {
  it("returns A, MX, and TXT records from injected resolver", async () => {
    const fake = {
      resolve4: async () => ["93.184.216.34"],
      resolveMx: async () => [{ exchange: "mail.example.com", priority: 10 }],
      resolveTxt: async () => [["v=spf1 include:_spf.example.com ~all"]],
    };
    const out = await inspectDomain("example.com", fake);
    assert.deepEqual(out.a, ["93.184.216.34"]);
    assert.deepEqual(out.mx, [{ exchange: "mail.example.com", priority: 10 }]);
    assert.match(out.txt[0], /spf1/);
  });

  it("returns empty arrays when resolver finds nothing", async () => {
    const fake = {
      resolve4: async () => {
        throw new Error("ENOTFOUND");
      },
      resolveMx: async () => {
        throw new Error("ENOTFOUND");
      },
      resolveTxt: async () => {
        throw new Error("ENOTFOUND");
      },
    };
    const out = await inspectDomain("missing.test", fake);
    assert.deepEqual(out, { domain: "missing.test", a: [], mx: [], txt: [] });
  });
});
`,
    http: null,
    smoke: false,
  },
  {
    n: 19,
    slug: "random-readable-stream",
    title: "Custom Readable Stream",
    difficulty: "medium",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/RandomDataStream.js",
    markers: ["RandomDataStream","Readable","push"],
    files: {
      "src/RandomDataStream.js": `import { Readable } from "node:stream";

export class RandomDataStream extends Readable {
  constructor({ count = 5, min = 0, max = 9, seed = null } = {}) {
    super({ objectMode: true });
    this.remaining = count;
    this.min = min;
    this.max = max;
    this.seed = seed;
    this.index = 0;
  }

  _read() {
    if (this.remaining <= 0) {
      this.push(null);
      return;
    }
    let value;
    if (this.seed != null) {
      value = ((this.seed + this.index) % (this.max - this.min + 1)) + this.min;
    } else {
      value = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    }
    this.index += 1;
    this.remaining -= 1;
    this.push(value);
  }
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { RandomDataStream } from "../src/RandomDataStream.js";

describe("RandomDataStream", () => {
  it("emits deterministic integers when seeded", async () => {
    const stream = new RandomDataStream({ count: 3, min: 1, max: 5, seed: 2 });
    const values = [];
    for await (const n of stream) values.push(n);
    assert.deepEqual(values, [3, 4, 5]);
  });

  it("ends after requested count", async () => {
    const stream = new RandomDataStream({ count: 2, seed: 0 });
    const values = [];
    for await (const n of stream) values.push(n);
    assert.equal(values.length, 2);
  });
});
`,
    http: null,
    smoke: false,
  },
  {
    n: 20,
    slug: "os-system-stats",
    title: "OS Metrics Monitor",
    difficulty: "easy",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/systemStats.js",
    markers: ["getSystemStats","loadavg","freemem"],
    files: {
      "src/systemStats.js": `import os from "node:os";

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
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getSystemStats } from "../src/systemStats.js";

describe("getSystemStats", () => {
  it("returns memory, load, and uptime", () => {
    const stats = getSystemStats();
    assert.equal(typeof stats.memoryUsagePercent, "number");
    assert.ok(Array.isArray(stats.loadAverage));
    assert.equal(stats.loadAverage.length, 3);
    assert.equal(typeof stats.uptime, "number");
  });

  it("keeps memory usage within valid percentage bounds", () => {
    const stats = getSystemStats();
    assert.ok(stats.memoryUsagePercent >= 0);
    assert.ok(stats.memoryUsagePercent <= 100);
    assert.ok(stats.uptime >= 0);
  });
});
`,
    http: null,
    smoke: true,
  },
  {
    n: 21,
    slug: "perf-hooks-measure",
    title: "Performance Hooks Benchmarking",
    difficulty: "easy",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/measureExecutionTime.js",
    markers: ["measureExecutionTime","performance.now"],
    files: {
      "src/measureExecutionTime.js": `import { performance } from "node:perf_hooks";

export async function measureExecutionTime(fn) {
  const start = performance.now();
  const result = await fn();
  const durationMs = performance.now() - start;
  return { result, durationMs };
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { measureExecutionTime } from "../src/measureExecutionTime.js";

describe("measureExecutionTime", () => {
  it("measures async function duration", async () => {
    const { result, durationMs } = await measureExecutionTime(async () => {
      await new Promise((r) => setTimeout(r, 5));
      return 42;
    });
    assert.equal(result, 42);
    assert.ok(durationMs >= 0);
  });

  it("measures sync return values", async () => {
    const { result, durationMs } = await measureExecutionTime(() => "ok");
    assert.equal(result, "ok");
    assert.ok(durationMs >= 0);
  });
});
`,
    http: null,
    smoke: false,
  },
  {
    n: 22,
    slug: "v8-heap-limits",
    title: "V8 Memory Heap Profiler",
    difficulty: "medium",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/heapLimits.js",
    markers: ["checkHeapLimits","getHeapStatistics"],
    files: {
      "src/heapLimits.js": `import v8 from "node:v8";

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
      ? \`Heap usage \${(usageRatio * 100).toFixed(1)}% exceeds \${threshold * 100}% threshold\`
      : null,
  };
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkHeapLimits } from "../src/heapLimits.js";

describe("checkHeapLimits", () => {
  it("returns heap statistics with ratio", () => {
    const stats = checkHeapLimits();
    assert.ok(stats.usedHeapSize > 0);
    assert.ok(stats.heapSizeLimit > 0);
    assert.ok(stats.usageRatio >= 0 && stats.usageRatio <= 1);
    assert.equal(typeof stats.exceeded, "boolean");
  });

  it("flags exceeded when threshold is forced low", () => {
    const stats = checkHeapLimits(0);
    assert.equal(stats.exceeded, true);
    assert.match(stats.warning ?? "", /exceeds/);
  });
});
`,
    http: null,
    smoke: false,
  },
  {
    n: 23,
    slug: "process-signal-shutdown",
    title: "Direct Process Signals Handling",
    difficulty: "medium",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/gracefulShutdown.js",
    markers: ["SIGINT","SIGTERM"],
    files: {
      "src/gracefulShutdown.js": `export function setupGracefulShutdown(server, options = {}) {
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
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { setupGracefulShutdown } from "../src/gracefulShutdown.js";

describe("setupGracefulShutdown", () => {
  it("closes server and clears timers on shutdown", async () => {
    let closed = false;
    const server = {
      close(cb) {
        closed = true;
        cb?.();
      },
    };
    const ctl = setupGracefulShutdown(server);
    ctl.registerTimer(setTimeout(() => {}, 10000));
    await ctl.shutdown("SIGTERM");
    assert.equal(closed, true);
    assert.equal(ctl.isShuttingDown(), true);
    ctl.dispose();
  });

  it("ignores duplicate shutdown attempts", async () => {
    const ctl = setupGracefulShutdown(null);
    await ctl.shutdown("SIGINT");
    await ctl.shutdown("SIGINT");
    assert.equal(ctl.isShuttingDown(), true);
    ctl.dispose();
  });
});
`,
    http: null,
    smoke: false,
  },
  {
    n: 24,
    slug: "console-json-logger",
    title: "Console Object Redirection",
    difficulty: "easy",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/jsonLogger.js",
    markers: ["JSON","timestamp","severity"],
    files: {
      "src/jsonLogger.js": `function write(stream, level, args) {
  const message = args
    .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
    .join(" ");
  stream.write(
    JSON.stringify({
      severity: level,
      timestamp: new Date().toISOString(),
      message,
    }) + "\\n",
  );
}

export const logger = {
  info: (...args) => write(process.stdout, "info", args),
  error: (...args) => write(process.stderr, "error", args),
  warn: (...args) => write(process.stdout, "warn", args),
};
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { logger } from "../src/jsonLogger.js";

describe("jsonLogger", () => {
  it("writes JSON lines with severity and timestamp", () => {
    const chunks = [];
    const original = process.stdout.write;
    process.stdout.write = (chunk) => {
      chunks.push(String(chunk));
      return true;
    };
    try {
      logger.info("hello");
      const line = JSON.parse(chunks[0]);
      assert.equal(line.severity, "info");
      assert.equal(line.message, "hello");
      assert.match(line.timestamp, /^\\d{4}-\\d{2}-\\d{2}T/);
    } finally {
      process.stdout.write = original;
    }
  });

  it("routes errors to stderr", () => {
    const chunks = [];
    const original = process.stderr.write;
    process.stderr.write = (chunk) => {
      chunks.push(String(chunk));
      return true;
    };
    try {
      logger.error("boom");
      const line = JSON.parse(chunks[0]);
      assert.equal(line.severity, "error");
      assert.equal(line.message, "boom");
    } finally {
      process.stderr.write = original;
    }
  });
});
`,
    http: null,
    smoke: false,
  },
  {
    n: 25,
    slug: "native-test-truncate",
    title: "Node.js Test Runner (Native `node:test`)",
    difficulty: "easy",
    tags: ["node-tasks","core","vanilla","node-core"],
    packages: [],
    bases: ["base-node"],
    gradeFile: "src/truncate.js",
    markers: ["truncate"],
    files: {
      "src/truncate.js": `export function truncate(value, maxLen) {
  if (value == null) return "";
  const str = String(value);
  const n = Number(maxLen);
  if (!Number.isFinite(n) || n <= 0) return "";
  if (str.length <= n) return str;
  return str.slice(0, n);
}
`,
      "test/truncate.test.js": `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { truncate } from "../src/truncate.js";

describe("truncate", () => {
  it("handles empty and null", () => {
    assert.equal(truncate("", 5), "");
    assert.equal(truncate(null, 5), "");
  });
  it("respects bounds", () => {
    assert.equal(truncate("abcdef", 3), "abc");
    assert.equal(truncate("hi", 10), "hi");
  });
});
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { truncate } from "../src/truncate.js";

describe("truncate oracle", () => {
  it("handles null and empty strings", () => {
    assert.equal(truncate(null, 5), "");
    assert.equal(truncate("", 3), "");
  });

  it("truncates to max length and rejects invalid bounds", () => {
    assert.equal(truncate("abcdef", 3), "abc");
    assert.equal(truncate("hi", 10), "hi");
    assert.equal(truncate("abc", 0), "");
    assert.equal(truncate("abc", -1), "");
  });
});
`,
    http: null,
    smoke: true,
  },
];
