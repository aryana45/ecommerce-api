import catchAsync from '../utils/catchAsync.js';

export const getMe = catchAsync(async (req, res, next) => {
  const { password, ...safeUser } = req.user ?? {};
  res.status(200).json({
    status: 'success',
    data: { user: safeUser },
  });
});
