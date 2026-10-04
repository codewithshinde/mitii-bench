import express from "express";

const jobs = new Map();
let nextId = 1;

function processJob(job) {
  const total = job.items.length;
  let processed = 0;
  const timer = setInterval(() => {
    processed = Math.min(total, processed + Math.max(1, Math.floor(total / 5)));
    job.processed = processed;
    job.percentage = total ? Math.round((processed / total) * 100) : 100;
    if (processed >= total) {
      job.status = "completed";
      clearInterval(timer);
    }
  }, 10);
}

const app = express();
app.use(express.json());

app.post("/api/jobs", (req, res) => {
  const items = req.body?.items ?? [];
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: "items required" });
  const jobId = String(nextId++);
  const job = { jobId, items, processed: 0, percentage: 0, status: "running" };
  jobs.set(jobId, job);
  processJob(job);
  res.status(202).json({ jobId });
});

app.get("/api/jobs/:id", (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: "not found" });
  res.json({ jobId: job.jobId, percentage: job.percentage, status: job.status });
});

const port = Number(process.env.PORT || 0);
const server = app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server, jobs };
