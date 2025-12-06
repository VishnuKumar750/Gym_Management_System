import { httpStatusCode } from '../config/http.config';

class ErrorHandler extends Error {
  public statusCode: httpStatusCode;
  public message: string;

  constructor(statusCode: httpStatusCode, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
