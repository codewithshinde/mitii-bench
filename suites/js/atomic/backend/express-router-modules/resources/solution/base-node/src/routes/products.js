import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => res.json({ items: [{ id: 1, name: "Widget" }] }));
export default router;
