import { Request, Response, NextFunction } from 'express'
import { HTTPSTATUS } from '../config/http.config'
import ApiError from '@/utils/ApiError'
import { ZodAny } from 'zod'

export const validate =
  (schema: ZodAny) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (err: any) {
      const message = err.errors?.[0]?.message || 'Invalid request data'
      next(new ApiError(message, HTTPSTATUS.BAD_REQUEST))
    }
  }
