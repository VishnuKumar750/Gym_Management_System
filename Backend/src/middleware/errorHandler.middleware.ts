import { ErrorRequestHandler } from 'express';
import { HTTPSTATUS } from '../config/http.config';
import { ApiResponse } from '../utils/apiResponse.utils';
import ErrorHandler from '../utils/ErrorHandler.utils';

const errorHandler: ErrorRequestHandler = (err: any, req, res, next) => {
  // Log detailed error only in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // Handle Invalid JSON Error
  if (err instanceof SyntaxError && 'body' in err) {
    const response = new ApiResponse(HTTPSTATUS.BAD_REQUEST, 'Invalid JSON format');
    return res.status(response.statusCode).json(response);
  }

  // Custom ErrorHandler errors
  if (err instanceof ErrorHandler) {
    const response = new ApiResponse(err.statusCode, err.message);
    return res.status(response.statusCode).json(response);
  }

  // Mongoose / Zod / Joi / Generic Validation Errors
  if (err.name === 'ValidationError') {
    const response = new ApiResponse(HTTPSTATUS.UNPROCESSABLE_ENTITY, err.message);
    return res.status(response.statusCode).json(response);
  }

  // TypeError fallback
  if (err instanceof TypeError) {
    const response = new ApiResponse(
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      'Unexpected type error occurred'
    );
    return res.status(response.statusCode).json(response);
  }

  // Unknown error fallback
  const response = new ApiResponse(
    HTTPSTATUS.INTERNAL_SERVER_ERROR,
    err.message || 'Internal Server Error'
  );
  return res.status(response.statusCode).json(response);
};

export default errorHandler;
