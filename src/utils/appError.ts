class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  status: string;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.status = this.statusCode.toString().startsWith('4')
      ? 'failure'
      : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}
export default AppError;
