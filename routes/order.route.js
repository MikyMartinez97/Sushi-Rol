import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// List current user's orders
router.get('/', requireAuth, );
// Get order by id
router.get('/:id', requireAuth, );
// Create a new order
router.post('/', requireAuth, );
// Cancel and order (limited window)
router.put('/:id/cancel', requireAuth, )

export default router;