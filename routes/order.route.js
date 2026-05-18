import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// List current user's orders
router.get('/', requireAuth, );
// Get order by id
router.get('/:id', requireAuth, );
// Create a new order
router.post('/', requireAuth, );
// Cancel and order (limited window)
router.put('/:id/cancel', requireAuth, )
// List all orders (admin only)
router.get('/', requireAuth, requireAdmin, );
// Update order status (admin only)
router.put('/:id', requireAuth, requireAdmin, );

export default router;