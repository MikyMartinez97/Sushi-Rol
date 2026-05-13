import express from "express";
import {
    getUsers, 
    getUserById,
    createUser,
    updateUser,
    deleteUser 
} from "../controllers/user.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router()

// Get users (admin only)
router.get('/', requireAuth, requireAdmin, getUsers);
// Get user by id
router.get('/:id', requireAuth, requireAdmin, getUserById);
// Create user
router.post('/', requireAuth, requireAdmin, createUser);
// Modify user
router.put('/:id', requireAuth, requireAdmin, updateUser);
// Delete user
router.delete('/:id', requireAuth, requireAdmin, deleteUser);

export default router;