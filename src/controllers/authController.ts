import config from '../config/index.js';
import * as authService from '../services/authService.js';
import catchAsync from '../utils/catchAsync.js';
import { Response } from 'express';
import AppError from '../utils/appError.js';

export const registerUser = catchAsync(async (req, res, next) => {
  const { token, user } = await authService.createUser(req.body);
  const { password, ...rest } = user;
  return res.status(201).json({
    status: 'success',
    token: token,
    data: { user: rest },
  });
});

export const loggedInUser = catchAsync(async (req, res, next) => {
  const { token, user } = await authService.loginUser(req.body);
 await createSendRefreshToken(user.id, res);
  const { password, ...rest } = user;

  return res.status(200).json({
    status: 'success',
    token: token,
    data: { user: rest },
  });
});

const createSendRefreshToken = async (userId: string, res: Response) => {
  const refreshToken = await authService.createRefreshToken(userId);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(Date.now() + config.RefreshTokenExpiresIn),
  });
};

export const handleRefreshTokenRefresh = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new AppError('You must login again to get access', 401));
  }
  const tokenHash = authService.hashRefreshToken(refreshToken);
  const { accessToken, userId } =
    await authService.getAccessTokenBasedOnRefreshToken(tokenHash);
  await createSendRefreshToken(userId, res);

  return res.status(200).json({
    status: 'success',
    token: accessToken,
  });
});

export const logout = catchAsync(async (req, res, next) => {
  if (!req.cookies.refreshToken) {
    await authService.logout(req.cookies.refreshToken);
  }

  res.clearCookie('refreshToken');
  return res.status(200).json({
    status: 'success',
    message: 'User Logged Out Successfully',
  });
});
