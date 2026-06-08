import * as productService from '../services/productService.js';
import catchAsync from '../utils/catchAsync.js';

export const createProduct = catchAsync(async (req, res, next) => {
  const product = await productService.createProduct(
    req.body,
    req.sellerProfile!.id
  );

  res.status(201).json({
    status: 'success',
    data: { product },
  });
});

export const getProducts = catchAsync(async (req, res, next) => {
  const products = await productService.getProducts(req.query);
  res.status(200).json({
    status: 'success',
    total: products.length,
    data: { products },
  });
});

export const getProduct = catchAsync(async (req, res, next) => {
  const product = await productService.getProduct(
    (req.params.id as string) ?? ''
  );
  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const product = await productService.updateProduct(
    req.body,
    (req.params.id as string) ?? '',
    req.sellerProfile?.id ?? ''
  );
  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  await productService.deleteProduct(
    (req.params.id as string) ?? '',
    req.sellerProfile?.id ?? ''
  );
  res.status(204).send();
});
