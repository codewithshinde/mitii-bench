import { buildServer } from "./server.js";

export const app = await buildServer();

if (process.env.MITII_NO_LISTEN !== "1") {
  const port = Number(process.env.PORT || 0);
  await app.listen({ port, host: "127.0.0.1" });
  console.log(`listening on ${port}`);
}
