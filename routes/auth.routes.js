import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    registerUser,
    login,
    logout,
    getProfile
} from '../controllers/auth.controller.js';

const router = express.Router();

// Create account, issue token
router.post('/register', registerUser);
// Verify credentials, issue token
router.post('/login', login);
// Clear cookie
router.post('/logout', logout);
// Return current user's profile
router.get('/me', requireAuth, getProfile);