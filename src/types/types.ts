import { Request, Response, NextFunction } from 'express';
import * as z from 'zod';
import { createUserSchema } from '../validations/userValidation.js';
import { createSellerSchema } from '../validations/sellerValidation.js';

export type middlewareFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export interface SellerParams {
  sellerId: string;
}

export type createUserInput = z.infer<typeof createUserSchema>['body'];
export type createSellerInput = z.infer<typeof createSellerSchema>['body'];
