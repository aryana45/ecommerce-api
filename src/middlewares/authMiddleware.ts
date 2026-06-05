import { RequestHandler } from 'express';
import prisma from '../lib/prisma.js';
import { verifyToken } from '../services/authService.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, _res, next) => {
  let token = '';
  const authorizationToken = req.headers.authorization;
  if (authorizationToken && authorizationToken.startsWith('Bearer')) {
    token = authorizationToken.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('User not authenticated', 401));
  }
  const decoded = await verifyToken(token);
  // console.log(decoded);

  // const currentTime = Date.now();
  // const expTime = (decoded.exp ?? 0) * 1000;
  // if (currentTime > expTime) {
  //   return next(new AppError('The access token has been expired', 401));
  // }  Global Error Handler handles expiry error

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });
  if (!user) {
    return next(new AppError('Could not find the user', 404));
  }
  req.user = user;
  next();
});

export const restrictTo = (roles: string[]): RequestHandler => {
  return catchAsync(async (req, _res, next) => {
    if (!roles.includes(req.user!.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }
    next();
  });
};
