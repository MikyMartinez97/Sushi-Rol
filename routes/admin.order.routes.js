import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// List all orders (admin only)
router.get('/', requireAuth, requireAdmin, );
// Update order status (admin only)
router.put('/:id', requireAuth, requireAdmin, );

export default router;