import { ErrorRequestHandler } from 'express';
import config from '../config/index.js';
import { ZodError } from 'zod';
import { Prisma } from '../generated/prisma/index.js';
import AppError from '../utils/appError.js';

const handlePrismaValidationError = (
  _err: Prisma.PrismaClientValidationError
): AppError => {
  return new AppError('Invalid input data. Please check your request.', 400);
};

const handlePrismaKnownError = (
  err: Prisma.PrismaClientKnownRequestError
): AppError => {
  const errorMap: Record<string, () => AppError> = {
    P2002: () => {
      const field = (err.meta?.target as string[])?.join(', ') || 'field';
      return new AppError(
        `Duplicate value found for ${field}. Please use a different value.`,
        409
      );
    },
    P2003: () => {
      const field =
        (err.meta?.field_name as string) ||
        (err.meta?.target as string) ||
        'unknown field';
      return new AppError(`Invalid reference for field: ${field}`, 400);
    },
    P2025: () => new AppError('Record not found.', 404),
    P2021: () => new AppError('The table does not exist.', 500),
    P2022: () => new AppError('The column does not exist.', 500),
  };

  return (
    errorMap[err.code]?.() || new AppError('Database error occurred.', 500)
  );
};

const handlePrismaInitializationError = (
  _err: Prisma.PrismaClientInitializationError
): AppError => {
  return new AppError(
    'Database connection failed. Please try again later.',
    500
  );
};

const handlePrismaRustPanicError = (
  _err: Prisma.PrismaClientRustPanicError
): AppError => {
  return new AppError(
    'Critical database error occurred. Please try again.',
    500
  );
};
const sendErrorDev: ErrorRequestHandler = (err, _req, res, _next) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stackTrace: err.stack,
  });
};

const handleJWTError = (): AppError =>
  new AppError('Invalid token please login again', 400);

const handleJWTExpiredError = (): AppError =>
  new AppError('Token has expired please login again', 400);

const sendZodErrors = (err: ZodError): AppError => {
  const message = err.issues
    .map((issue) => {
      const field = issue.path[issue.path.length - 1];
      console.log(issue);
      if (issue.code === 'invalid_type') {
        return `${String(field)} is required`;
      }

      if (issue.code === 'invalid_value') {
        return `${String(field)} is invalid`;
      }

      if (issue.code === 'too_small') {
        return `${String(field)} is too short`;
      }

      return issue.message;
    })
    .join(', ');

  return new AppError(message, 400);
};

const sendErrorProd: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    return res.status(err.statusCode).json({
      status: err.status,
      message: 'Internal Server Error',
    });
  }
};

const ErrorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.nodeEnv === 'production') {
    let error = { ...err };
    if (err instanceof ZodError) error = sendZodErrors(err);
    if (err instanceof Prisma.PrismaClientValidationError) {
      error = handlePrismaValidationError(err);
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      error = handlePrismaKnownError(err);
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
      error = handlePrismaInitializationError(err);
    } else if (err instanceof Prisma.PrismaClientRustPanicError) {
      error = handlePrismaRustPanicError(err);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    } else if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }
    sendErrorProd(error, req, res, next);
  } else {
    sendErrorDev(err, req, res, next);
  }
};

export default ErrorMiddleware;
