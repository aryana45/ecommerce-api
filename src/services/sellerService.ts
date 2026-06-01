import prisma from '../lib/prisma.js';
import { createSellerInput } from '../types/types.js';
import AppError from '../utils/appError.js';

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
