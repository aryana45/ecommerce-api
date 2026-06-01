import express from 'express';
import {
  addSeller,
  updateSellerStatus,
} from '../controllers/sellerController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validationMiddleware.js';
import { createSellerSchema } from '../validations/sellerValidation.js';

export const router = express.Router();
router.post(
  '/apply',
  protect,
  validateRequest(createSellerSchema),
  restrictTo(['BUYER']),
  addSeller
);

router.patch(
  '/:sellerId/status',
  protect,
  restrictTo(['ADMIN']),
  updateSellerStatus
);
