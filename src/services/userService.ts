import prisma from '../lib/prisma.js';
import { createUserInput } from '../types/types.js';

export const updateMe = async (payload: createUserInput, id: string) => {
  const user = prisma.user.update({
    data: payload,
    where: { id: id },
  });
  return user;
};
