/**
 * Dry-run solutions + node:test oracles for smoke / core Node cases.
 * Keys are case slugs under suites/js/atomic/backend/.
 */
export const nodeCoreSolutions = {
  "buffer-file-type": {
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
  },

  "crypto-scrypt-password": {
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
  },

  "path-traversal-defense": {
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
  },

  "url-sanitize-redirect": {
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
});
`,
  },

  "os-system-stats": {
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
});
`,
  },

  "perf-hooks-measure": {
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
  it("measures sync work", async () => {
    const { result, durationMs } = await measureExecutionTime(() => 42);
    assert.equal(result, 42);
    assert.ok(durationMs >= 0);
  });
});
`,
  },

  "console-json-logger": {
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
  it("exports leveled logger methods", () => {
    assert.equal(typeof logger.info, "function");
    assert.equal(typeof logger.error, "function");
    assert.equal(typeof logger.warn, "function");
  });
});
`,
  },

  "native-test-truncate": {
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
  },

  "data-masking": {
    files: {
      "src/maskSensitive.js": `const SENSITIVE = new Set(["ssn", "creditcard", "credit_card", "password"]);

export function maskSensitive(input) {
  if (Array.isArray(input)) return input.map((v) => maskSensitive(v));
  if (!input || typeof input !== "object") return input;
  const out = {};
  for (const [key, value] of Object.entries(input)) {
    const norm = key.toLowerCase().replace(/[^a-z]/g, "");
    if (SENSITIVE.has(norm)) {
      out[key] = "***REDACTED***";
    } else if (value && typeof value === "object") {
      out[key] = maskSensitive(value);
    } else {
      out[key] = value;
    }
  }
  return out;
}
`,
    },
    oracle: `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { maskSensitive } from "../src/maskSensitive.js";

describe("maskSensitive", () => {
  it("redacts nested sensitive keys", () => {
    const out = maskSensitive({
      name: "Ada",
      password: "secret",
      nested: { ssn: "111-22-3333", creditCard: "4111" },
    });
    assert.equal(out.name, "Ada");
    assert.equal(out.password, "***REDACTED***");
    assert.equal(out.nested.ssn, "***REDACTED***");
    assert.equal(out.nested.creditCard, "***REDACTED***");
  });
});
`,
  },

  "http-native-server": {
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
    httpGrade: {
      start: { command: "node src/index.js" },
      timeoutMs: 15000,
      requests: [
        {
          method: "GET",
          path: "/health",
          expect: { status: 200, jsonPaths: ["status", "uptime"], jsonSubset: { status: "ok" } },
        },
        {
          method: "POST",
          path: "/echo",
          json: { hello: "world" },
          expect: { status: 200, jsonSubset: { hello: "world" } },
        },
      ],
    },
  },
};
