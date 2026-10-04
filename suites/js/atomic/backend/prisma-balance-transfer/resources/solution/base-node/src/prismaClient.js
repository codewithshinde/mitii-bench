import Database from "better-sqlite3";

const db = new Database(":memory:");
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    balance REAL NOT NULL DEFAULT 0
  );
  INSERT INTO users (id, name, balance) VALUES (1, 'Alice', 100), (2, 'Bob', 50);
`);

/** Prisma-shaped client backed by SQLite for dry-run. */
export const prisma = {
  user: {
    findUnique({ where: { id } }) {
      return db.prepare("SELECT id, name, balance FROM users WHERE id = ?").get(id) ?? null;
    },
    update({ where: { id }, data: { balance } }) {
      db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(balance, id);
      return prisma.user.findUnique({ where: { id } });
    },
  },
  async $transaction(fn) {
    db.exec("BEGIN IMMEDIATE");
    try {
      const result = await fn(prisma);
      db.exec("COMMIT");
      return result;
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
  },
};
