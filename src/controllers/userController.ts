import catchAsync from '../utils/catchAsync.js';
import * as userService from '../services/userService.js';

export const getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user?.id ?? '';
  next();
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await userService.getUser((req.params.id ?? '') as string);
  const { password, ...safeUser } = user ?? {};
  return res.status(200).json({
    status: 'success',
    data: { user: safeUser },
  });
});
