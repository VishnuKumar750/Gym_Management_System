import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod/v3';
import ErrorHandler from '../utils/ErrorHandler.utils';
import { HTTPSTATUS } from '../config/http.config';

export const validate =
  (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (err: any) {
      const message = err.errors?.[0]?.message || 'Invalid request data';
      next(new ErrorHandler(HTTPSTATUS.BAD_REQUEST, message));
    }
  };
