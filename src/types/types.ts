import { Request, Response, NextFunction } from 'express';
import * as z from 'zod';
import { createUserSchema } from '../validations/userValidation.js';

export type middlewareFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export type createUserInput = z.infer<typeof createUserSchema>['body'];
