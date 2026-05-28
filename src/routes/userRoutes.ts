import express from 'express';
import { loggedInUser, registerUser } from '../controllers/authController.js';
import { validateRequest } from '../middlewares/validationMiddleware.js';
import { createUserSchema } from '../validations/userValidation.js';

export const router = express.Router();

router.post('/register', validateRequest(createUserSchema), registerUser);
router.post('/login', loggedInUser);
