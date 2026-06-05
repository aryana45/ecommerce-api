import express from 'express';
import {
  addSeller,
  getOneSeller,
  getSeller,
  updateSellerStatus,
} from '../controllers/sellerController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validationMiddleware.js';
import { createSellerSchema } from '../validations/sellerValidation.js';

export const router = express.Router();

router.get('/', protect, restrictTo(['ADMIN']), getSeller);
router.post(
  '/apply',
  protect,
  validateRequest(createSellerSchema),
  restrictTo(['BUYER']),
  addSeller
);
router.get('/:sellerId', protect, getOneSeller);
router.patch(
  '/:sellerId/status',
  protect,
  restrictTo(['ADMIN']),
  updateSellerStatus
);
