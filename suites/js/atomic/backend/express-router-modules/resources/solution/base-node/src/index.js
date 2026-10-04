import express from "express";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";

export const app = express();
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/orders", ordersRouter);

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(`listening on ${address.port}`);
});
