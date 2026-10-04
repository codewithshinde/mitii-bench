import Fastify from "fastify";
import dbPlugin from "./dbPlugin.js";

export async function buildServer() {
  const app = Fastify({ logger: false });
  await app.register(dbPlugin);
  app.get("/db-check", async (req) => req.server.db.query("SELECT 1"));
  return app;
}
