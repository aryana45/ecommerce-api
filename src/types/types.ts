import { Request, Response, NextFunction } from 'express';
export type middlewareFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;
