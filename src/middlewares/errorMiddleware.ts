import { ErrorRequestHandler } from 'express';
import config from '../config/index.js';

const sendErrorDev: ErrorRequestHandler = (err, _req, res, _next) => {
  return res.status(err.statusCode).send({
    status: err.status,
    message: err.message,
    error: err,
    stackTrace: err.stack,
  });
};

const sendErrorProd: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).send({
      status: err.status,
      message: err.message,
    });
  } else {
    return res.status(err.statusCode).send({
      status: err.status,
      message: 'Internal Server Error',
    });
  }
};

const ErrorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.nodeEnv === 'production') {
    sendErrorProd(err, req, res, next);
  } else {
    sendErrorDev(err, req, res, next);
  }
};

export default ErrorMiddleware;
