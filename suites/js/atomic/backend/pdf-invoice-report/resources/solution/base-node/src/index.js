import express from "express";
import PDFDocument from "pdfkit";

const app = express();
app.use(express.json());

app.post("/api/reports/invoice-pdf", (req, res) => {
  const { invoiceId = "INV-1", customer = "Acme", total = 100 } = req.body ?? {};
  res.setHeader("content-type", "application/pdf");
  const doc = new PDFDocument();
  doc.pipe(res);
  doc.fontSize(18).text("Invoice", { underline: true });
  doc.moveDown().fontSize(12).text(`Invoice ID: ${invoiceId}`);
  doc.text(`Customer: ${customer}`);
  doc.text(`Total: $${total}`);
  doc.end();
});

const port = Number(process.env.PORT || 0);
const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server };
