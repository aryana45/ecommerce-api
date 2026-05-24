import { RequestHandler } from 'express';
import { middlewareFn } from '../types/types.js';

const catchAsync = (fn: middlewareFn): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
