import { HTTPSTATUS } from '@/config/http.config'
import { Request, Response, NextFunction } from 'express'
import { logger } from '@/utils/logger'

interface ErrorResponse {
  success: false
  error: {
    statusCode: number
    message: string
    code?: string
    details?: string
    stack?: string
  }
}

const globalErrorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = err.statusCode || HTTPSTATUS.INTERNAL_SERVER_ERROR
  let message = err.message || 'Something went wrong'
  let details: string | undefined

  // =========================
  // Known error handling
  // =========================

  // Invalid Mongo ObjectId
  if (err.name === 'CastError') {
    statusCode = HTTPSTATUS.BAD_REQUEST
    message = `Invalid ${err.path}`
    details = `Invalid value: ${err.value}`
  }

  // Duplicate key error
  else if (err.code === 11000) {
    statusCode = HTTPSTATUS.CONFLICT
    message = `Duplicate value for ${Object.keys(err.keyValue).join(', ')}`
  }

  // Mongoose validation error
  else if (err.name === 'ValidationError') {
    statusCode = HTTPSTATUS.BAD_REQUEST
    message = 'Invalid input data'
    details = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(', ')
  }

  // =========================
  // Expose error to Morgan
  // =========================
  res.locals.errorMessage = message

  // =========================
  // Log error (central place)
  // =========================
  logger.error('API Error', {
    meta: {
      userId: (req as any).user?.id || null,
      role: (req as any).user?.role || 'anonymous',
      method: req.method,
      endpoint: req.originalUrl,
      statusCode,
      message,
      ...(details && { details })
    }
  })

  // =========================
  // Response
  // =========================
  const response: ErrorResponse = {
    success: false,
    error: {
      statusCode,
      message,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && err.stack ? { stack: err.stack } : {})
    }
  }

  res.status(statusCode).json(response)
}

export default globalErrorHandler
