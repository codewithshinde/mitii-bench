import express from "express";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ok = ["image/png", "image/jpeg"].includes(file.mimetype);
    cb(ok ? null : new Error("Invalid mime type"), ok);
  },
});

export const app = express();

app.post("/api/upload", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      const status = err.message === "Invalid mime type" || err.code === "LIMIT_FILE_SIZE" ? 400 : 500;
      return res.status(status).json({ error: err.message });
    }
    if (!req.file) return res.status(400).json({ error: "No file" });
    res.json({ filename: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype });
  });
});

const port = Number(process.env.PORT || 0);
export const server = process.env.MITII_NO_LISTEN === "1"
  ? { close() {}, address: () => null }
  : app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(`listening on ${address.port}`);
});
