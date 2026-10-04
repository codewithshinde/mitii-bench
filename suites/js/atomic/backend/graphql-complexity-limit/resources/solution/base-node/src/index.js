import express from "express";

export function analyzeQuery(query, { maxDepth = 5, maxComplexity = 20 } = {}) {
  const depth = (query.match(/{/g) ?? []).length;
  const fields = (query.match(/\w+/g) ?? []).length;
  const complexity = depth * fields;
  return { depth, complexity, allowed: depth <= maxDepth && complexity <= maxComplexity };
}

const app = express();
app.use(express.json());
app.post("/graphql", (req, res) => {
  const query = req.body?.query ?? "";
  const report = analyzeQuery(query);
  if (!report.allowed) return res.status(400).json({ error: "query too complex", ...report });
  res.json({ data: { ok: true }, ...report });
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server };
