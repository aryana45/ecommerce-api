import prisma from '../lib/prisma.js';
import { verifyToken } from '../services/authService.js';
import { createUserInput } from '../types/types.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, res, next) => {
  let token = '';
  const authorizationToken = req.headers.authorization;
  if (authorizationToken && authorizationToken.startsWith('Bearer')) {
    token = authorizationToken.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('The authoziation token is missing', 401));
  }
  const decoded = await verifyToken(token);
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });
  if (!user) {
    return next(new AppError('Could not find the user', 404));
  }
  req.user = user;
  next();
});
