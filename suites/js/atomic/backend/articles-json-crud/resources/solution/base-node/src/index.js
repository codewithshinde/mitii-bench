import express from "express";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "articles.json");
const TMP_FILE = join(DATA_DIR, "articles.json.tmp");

export async function loadArticles() {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

export async function saveArticles(articles) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(TMP_FILE, JSON.stringify(articles, null, 2));
  await rename(TMP_FILE, DATA_FILE);
}

const app = express();
app.use(express.json());

app.get("/articles", async (_req, res) => res.json(await loadArticles()));

app.post("/articles", async (req, res) => {
  const { title, body } = req.body ?? {};
  if (!title) return res.status(400).json({ error: "title required" });
  const articles = await loadArticles();
  const id = articles.length ? Math.max(...articles.map((a) => a.id)) + 1 : 1;
  const article = { id, title, body: body ?? "" };
  articles.push(article);
  await saveArticles(articles);
  res.status(201).json(article);
});

app.put("/articles/:id", async (req, res) => {
  const articles = await loadArticles();
  const idx = articles.findIndex((a) => String(a.id) === req.params.id);
  if (idx < 0) return res.status(404).json({ error: "not found" });
  articles[idx] = { ...articles[idx], ...req.body, id: articles[idx].id };
  await saveArticles(articles);
  res.json(articles[idx]);
});

app.delete("/articles/:id", async (req, res) => {
  const articles = await loadArticles();
  const next = articles.filter((a) => String(a.id) !== req.params.id);
  if (next.length === articles.length) return res.status(404).json({ error: "not found" });
  await saveArticles(next);
  res.status(204).end();
});

const port = Number(process.env.PORT || 0);
const server = app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server };
