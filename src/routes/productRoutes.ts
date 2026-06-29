import express from 'express';
import {
  protect,
  protectProductOwnership,
  protectSeller,
  restrictTo,
} from '../middlewares/authMiddleware.js';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  resizeImageSize,
  updateProduct,
  uploadProductImages,
  uploadToCloudinary,
} from '../controllers/productController.js';
import { validateRequest } from '../middlewares/validationMiddleware.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../validations/productValidation.js';

export const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(
    protectSeller,
    uploadProductImages,
    resizeImageSize,
    uploadToCloudinary,
    validateRequest(createProductSchema),
    createProduct
  );

router
  .route('/:id')
  .get(getProduct)
  .patch(
    protectSeller,
    uploadProductImages,
    resizeImageSize,
    uploadToCloudinary,
    validateRequest(updateProductSchema),
    updateProduct
  )
  .delete(protectSeller, deleteProduct);
