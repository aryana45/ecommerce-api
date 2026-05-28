import { RequestHandler } from 'express';
import { ZodObject } from 'zod';
import catchAsync from '../utils/catchAsync.js';

export const validateRequest = (schema: ZodObject): RequestHandler => {
  return catchAsync(async (req, _res, next) => {
    schema.parse({ body: req.body });
    next();
  });
};
