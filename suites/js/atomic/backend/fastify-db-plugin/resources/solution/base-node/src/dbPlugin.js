import fp from "fastify-plugin";

async function dbPlugin(fastify) {
  const db = {
    query(sql) {
      return { sql, rows: [] };
    },
  };
  fastify.decorate("db", db);
}

export default fp(dbPlugin, { name: "db-plugin" });
