import catchAsync from '../utils/catchAsync.js';
import * as categoryService from '../services/categoryService.js';

export const createCategory = catchAsync(async (req, res, next) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({
    status: 'success',
    data: { category },
  });
});

export const getCategories = catchAsync(async (req, res, next) => {
  const categories = await categoryService.getCategories(req.query);
  res.status(200).json({
    status: 'success',
    total: categories.length,
    data: { categories },
  });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  await categoryService.deleteCategory((req.params.id as string) ?? '');
  res.status(204).send();
});
