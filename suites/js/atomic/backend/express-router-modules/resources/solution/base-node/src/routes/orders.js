import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => res.json({ items: [{ id: 99, total: 42 }] }));
export default router;
