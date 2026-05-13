import express from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/category.controller.js'

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategory);

router.post('/', requireAuth, requireAdmin, createCategory);
router.put('/:id', requireAuth, requireAdmin, updateCategory);
router.delete('/:id', requireAuth, requireAdmin, deleteCategory);

export default router;