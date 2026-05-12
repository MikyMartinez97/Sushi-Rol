import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import {
  getProducts,
  getProductById,
  createProduct,
  modifyProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

const router = express.Router();

// List all products
router.get('/', getProducts);
// Get a product by ID
router.get('/:id', getProductById);
// Create a new product (admin only)
router.post('/', requireAuth, requireAdmin, createProduct);
// Modify product (admin only)
router.put("/:id", requireAuth, requireAdmin, modifyProduct);
// Delete product (admin only)
router.delete("/:id", requireAuth, requireAdmin, deleteProduct);

export default router;