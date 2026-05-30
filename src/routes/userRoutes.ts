import express from 'express';
import {
  handleRefreshTokenRefresh,
  loggedInUser,
  logout,
  registerUser,
} from '../controllers/authController.js';
import { validateRequest } from '../middlewares/validationMiddleware.js';
import { createUserSchema } from '../validations/userValidation.js';
import { protect } from '../middlewares/authMiddleware.js';
import { getMe } from '../controllers/userController.js';

export const router = express.Router();

router.post('/register', validateRequest(createUserSchema), registerUser);
router.post('/login', loggedInUser);
router.get('/me', protect, getMe);
router.post('/refresh-token', handleRefreshTokenRefresh);
router.post('/logout',logout)