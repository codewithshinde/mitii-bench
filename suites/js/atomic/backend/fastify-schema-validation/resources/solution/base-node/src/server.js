import Fastify from "fastify";

export async function buildServer() {
  const app = Fastify({ logger: false });
  app.post(
    "/items",
    {
      schema: {
        body: {
          type: "object",
          required: ["name", "qty"],
          properties: { name: { type: "string" }, qty: { type: "integer", minimum: 1 } },
        },
        response: {
          201: {
            type: "object",
            properties: { id: { type: "integer" }, name: { type: "string" }, qty: { type: "integer" } },
          },
        },
      },
    },
    async (req) => ({ id: 1, ...req.body }),
  );
  return app;
}

const port = Number(process.env.PORT || 0);
const app = await buildServer();
await app.listen({ port, host: "127.0.0.1" });
console.log(`listening on ${port}`);
export { app };
