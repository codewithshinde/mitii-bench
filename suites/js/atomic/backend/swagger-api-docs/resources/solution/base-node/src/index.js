import express from "express";
import swaggerUi from "swagger-ui-express";

const spec = {
  openapi: "3.0.0",
  info: { title: "Mitii API", version: "1.0.0" },
  paths: { "/health": { get: { summary: "Health", responses: { 200: { description: "OK" } } } } },
};

export const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(`listening on ${address.port}`);
});
