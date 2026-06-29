import { Prisma } from '../generated/prisma/index.js';
import prisma from '../lib/prisma.js';
import { createCategoryInput } from '../types/types.js';
import { ApiFeatures } from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';

type FindManyArgs = Prisma.CategoryFindManyArgs;

export const getCategories = async (reqQuery: Record<string, unknown>) => {
  const query = new ApiFeatures(reqQuery)
    .filter()
    .limitFields()
    .pagination()
    .sort()
    .build();
  const categories = await prisma.category.findMany(query as FindManyArgs);
  return categories;
};

export const createCategory = async (payload: createCategoryInput) => {
  const category = await prisma.category.create({
    data: payload,
  });
  return category;
};

export const deleteCategory = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: {
      categoryId: id,
    },
  });
  if (product) {
    throw new AppError(
      'This category has products,Delete or assign them to different category to do this operation',
      400
    );
  }
  await prisma.category.delete({
    where: { id: id },
  });
};
