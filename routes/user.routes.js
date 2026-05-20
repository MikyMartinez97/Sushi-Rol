import express from "express";
import {
    getUsers, 
    getUserById,
    createUser,
    updateUser,
    deleteUser 
} from "../controllers/user.controller.js";
import {
    getMyAddresses,
    getAddressesByUserId,
    createMyAddress,
    createAddressForUser
} from '../controllers/address.controller.js';
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router()

// Get users (admin only)
router.get('/', requireAuth, requireAdmin, getUsers);
// Get user's addresses
router.get('/me/addresses', requireAuth, getMyAddresses);
// Get user's addresses by user id
router.get('/:id/addresses', requireAuth, requireAdmin, getAddressesByUserId);
// Create user's address
router.post('/me/addresses', requireAuth, createMyAddress);
// Create user's address by user id
router.post('/:id/addresses', requireAuth, requireAdmin, createAddressForUser);
// Get user by id
router.get('/:id', requireAuth, requireAdmin, getUserById);
// Create user
router.post('/', requireAuth, requireAdmin, createUser);
// Modify user
router.put('/:id', requireAuth, requireAdmin, updateUser);
// Delete user
router.delete('/:id', requireAuth, requireAdmin, deleteUser);

export default router;