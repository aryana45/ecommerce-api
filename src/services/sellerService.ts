import prisma from '../lib/prisma.js';
import { Prisma } from '../generated/prisma/index.js';
import { createSellerInput } from '../types/types.js';
import { ApiFeatures } from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';

type FindManyArgs = Prisma.SellerProfileFindManyArgs;

export const addSeller = async (payload: createSellerInput, userId: string) => {
  const seller = await prisma.sellerProfile.create({
    data: { ...payload, userId: userId },
  });
  return seller;
};

export const checkApprovedSeller = async (userId: string) => {
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: userId },
  });

  if (!sellerProfile || sellerProfile.status !== 'APPROVED') {
    throw new AppError("You don't have an approved seller profile", 403);
  }
  return sellerProfile;
};

export const updateSellerStatus = async (
  sellerId: string,
  status: 'REJECTED' | 'APPROVED'
) => {
  const seller = await prisma.sellerProfile.findUnique({
    where: { id: sellerId },
  });
  if (!seller) {
    throw new AppError('Seller not found', 404);
  }

  if (seller.status !== 'PENDING') {
    throw new AppError(`Seller is already ${seller.status}`, 409);
  }

  const updatedSeller = await prisma.sellerProfile.update({
    where: { id: sellerId },
    data: { status: status },
  });
  return updatedSeller;
};

export const getSeller = async (reqQuery: Record<string, unknown>) => {
  const query = new ApiFeatures(reqQuery)
    .filter()
    .sort()
    .limitFields()
    .pagination()
    .build();

  const sellers = await prisma.sellerProfile.findMany(query as FindManyArgs);
  return sellers;
};

export const getOneSeller = async (id: string) => {
  const seller = await prisma.sellerProfile.findUnique({
    where: { id },
    select: { storeDescription: true, storeName: true },
  });
  return seller;
};
