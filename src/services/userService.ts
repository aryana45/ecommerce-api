import prisma from '../lib/prisma.js';
import { createUserInput } from '../types/types.js';

export const updateMe = async (payload: createUserInput, id: string) => {
  const user = prisma.user.update({
    data: payload,
    where: { id: id },
  });
  return user;
};

export const getUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { sellerProfile: true },
  });
  return user;
};
