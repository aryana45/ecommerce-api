import express from 'express';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import {
  createCategory,
  deleteCategory,
  getCategories,
} from '../controllers/categoryController.js';
import { validateRequest } from '../middlewares/validationMiddleware.js';
import { createCategorySchema } from '../validations/categoryValidation.js';

export const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(
    protect,
    restrictTo(['admin']),
    validateRequest(createCategorySchema),
    createCategory
  );

router.delete('/:id', protect, restrictTo(['admin']), deleteCategory);
