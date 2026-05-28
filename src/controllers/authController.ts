import { createUser, loginUser } from '../services/authService.js';
import catchAsync from '../utils/catchAsync.js';

export const registerUser = catchAsync(async (req, res, next) => {
  const { token, user } = await createUser(req.body);
  const { password, ...rest } = user;
  return res.status(201).json({
    status: 'success',
    token: token,
    data: { user: rest },
  });
});

export const loggedInUser = catchAsync(async (req, res, next) => {
  const { token, user } = await loginUser(req.body);
  const { password, ...rest } = user;
  return res.status(201).json({
    status: 'success',
    token: token,
    data: { user: rest },
  });
});
