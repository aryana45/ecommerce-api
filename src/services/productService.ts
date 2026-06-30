import prisma from '../lib/prisma.js';
import { createProductInput, updateProductInput } from '../types/types.js';
import { ApiFeatures } from '../utils/apiFeatures.js';
import { Prisma } from '../generated/prisma/index.js';
import AppError from '../utils/appError.js';

type FindManyArgs = Prisma.ProductFindManyArgs;

export const createProduct = async (
  payload: createProductInput,
  sellerId: string
) => {
  const product = await prisma.product.create({
    data: {
      ...payload,
      sellerId: sellerId,
    },
  });
  return product;
};

export const getProducts = async (reqQuery: Record<string, unknown>) => {
  const query = new ApiFeatures(reqQuery)
    .filter()
    .sort()
    .limitFields()
    .pagination()
    .build();
  if (reqQuery.cursorCreatedAt) {
    query.where = {
      ...query.where,
      OR: [
        {
          createdAt: {
            lt: reqQuery.cursorCreatedAt,
          },
        },
        {
          createdAt: reqQuery.cursorCreatedAt,
          id: {
            lt: reqQuery.cursorId,
          },
        },
      ],
    };
  }
  query.orderBy = [
    ...(query.orderBy as Record<string, 'asc' | 'desc'>[]),
    { id: 'desc' },
  ];
  // console.log(query);
  const products = await prisma.product.findMany(query as FindManyArgs);
  return products;
};

export const getProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      seller: { select: { storeName: true, storeDescription: true } },
    },
  });
  if (!product) {
    throw new AppError('Could not find the product', 404);
  }
  return product;
};

export const updateProduct = async (
  payload: updateProductInput,
  id: string,
  sellerId: string
) => {
  const product = await prisma.product.update({
    where: { id: id, sellerId: sellerId },
    data: { ...payload },
  });

  return product;
};

export const deleteProduct = async (id: string, sellerId: string) => {
  await prisma.product.delete({
    where: { id: id, sellerId: sellerId },
  });
};
