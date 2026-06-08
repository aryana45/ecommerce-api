import catchAsync from '../utils/catchAsync.js';
import * as sellerService from '../services/sellerService.js';
import AppError from '../utils/appError.js';

export const addSeller = catchAsync(async (req, res) => {
  const seller = await sellerService.addSeller(req.body, req.user!.id);

  res.status(201).json({
    status: 'success',
    data: { seller: seller },
  });
});

export const requireApprovedSeller = catchAsync(async (req, _res, next) => {
  const sellerProfile = await sellerService.checkApprovedSeller(req.user!.id);
  req.sellerProfile = sellerProfile;
  next();
});

export const updateSellerStatus = catchAsync(async (req, res, next) => {
  if (!['REJECTED', 'APPROVED', 'PENDING'].includes(req.body.status)) {
    return next(new AppError('The status is not correct', 400));
  }
  const updatedSeller = await sellerService.updateSellerStatus(
    req.params.sellerId as string,
    req.body.status
  );
  res.status(200).json({
    status: 'success',
    data: { seller: updatedSeller },
  });
});

export const getSeller = catchAsync(async (req, res, next) => {
  const sellers = await sellerService.getSeller(req.query);
  res.status(200).json({
    status: 'success',
    total: sellers.length,
    data: { sellers },
  });
});

export const getOneSeller = catchAsync(async (req, res, next) => {
  const seller = await sellerService.getOneSeller(
    (req.params?.sellerId ?? '') as string
  );
  return res.status(200).json({
    status: 'success',
    data: { seller },
  });
});
