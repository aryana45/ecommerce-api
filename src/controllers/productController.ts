import * as productService from '../services/productService.js';
import AppError from '../utils/appError.js';
import { FileFilterCallback } from 'multer';
import { Request } from 'express';
import catchAsync from '../utils/catchAsync.js';
import multer from 'multer';
import streamifier from 'streamifier';
import { UploadApiResponse } from 'cloudinary';
import sharp from 'sharp';
import cloudinary from '../lib/cloudinary.js';

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) {
    // console.log(file);
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only files', 404));
  }
};
const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadProductImages = upload.array('images', 5);
export const uploadToCloudinary = catchAsync(async (req, res, next) => {
  if (!req.buffers || req.buffers.length === 0) {
    return next();
  }
  const imagesId = req.buffers?.map(async (buffer) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'products',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  });
  const uploadedImages = (await Promise.all(imagesId)) as UploadApiResponse[];
  req.body.images = uploadedImages.map((image) => image.public_id);
  next();
});

export const resizeImageSize = catchAsync(async (req, res, next) => {
  const files = req.files as Express.Multer.File[];
  if (!files) {
    return next();
  }

  const images = files.map(async (element, i) => {
    return await sharp(element.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toBuffer();
  });
  const resizedImages = await Promise.all(images);
  req.buffers = resizedImages;
  next();
});

export const createProduct = catchAsync(async (req, res, next) => {
  const product = await productService.createProduct(
    req.body,
    req.sellerProfile!.id
  );

  res.status(201).json({
    status: 'success',
    data: { product },
  });
});

export const getProducts = catchAsync(async (req, res, next) => {
  const products = await productService.getProducts(req.query);
  res.status(200).json({
    status: 'success',
    total: products.length,
    data: { products },
  });
});

export const getProduct = catchAsync(async (req, res, next) => {
  const product = await productService.getProduct(
    (req.params.id as string) ?? ''
  );
  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const product = await productService.updateProduct(
    req.body,
    (req.params.id as string) ?? '',
    req.sellerProfile?.id ?? ''
  );
  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  await productService.deleteProduct(
    (req.params.id as string) ?? '',
    req.sellerProfile?.id ?? ''
  );
  res.status(204).send();
});
