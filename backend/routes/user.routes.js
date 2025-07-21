// backend/routes/user.routes.js

import express from 'express';
import { registerUser, loginUser, getUserProfile, updatePassword, updateUsername } from '../controller/user.controller.js';
import { verifyToken } from '../middleware/user.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private route - requires a valid token
router.get('/profile', verifyToken, getUserProfile);
router.patch('/update-username', verifyToken, updateUsername);
router.patch('/update-password', verifyToken, updatePassword);



export default router;