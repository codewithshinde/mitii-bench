import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const DB_PATH = process.env.DB_PATH || process.env.TODO_DB_PATH || "db.sqlite";

mkdirSync(dirname(DB_PATH) === "." ? "." : dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS cards (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    suit TEXT NOT NULL
  );
`);

export function resetTodos() {
  db.exec("DELETE FROM todos");
}
