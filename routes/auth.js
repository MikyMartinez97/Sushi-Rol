import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Create account, issue token
router.post('/register', );
// Verify credentials, issue token
router.post('/login', )
// Clear cookie
router.post('/logout', requireAuth, )
// Return current user's profile
router.post('/me', requireAuth, );