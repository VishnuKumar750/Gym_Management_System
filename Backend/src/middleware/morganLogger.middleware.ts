import morgan from 'morgan'
import { logger } from '@/utils/logger'
import { Request } from 'express'

// custom tokens
morgan.token('userId', (req: any) => req.user?.id || 'anonymous')
morgan.token('role', (req: any) => req.user?.role || 'guest')
morgan.token('operation', (req: Request) => `${req.method} ${req.originalUrl}`)
morgan.token('error', (_req, res: any) => res.locals?.errorMessage || null)

export const morganLogger = morgan((tokens, req: any, res: any) => {
  const status = Number(tokens.status(req, res))

  const meta = {
    userId: tokens.userId(req, res),
    role: tokens.role(req, res),
    method: tokens.method(req, res),
    endpoint: tokens.url(req, res),
    operation: tokens.operation(req, res),
    statusCode: status,
    responseTime: `${tokens['response-time'](req, res)}ms`,
    error: tokens.error(req, res)
  }

  if (status >= 500) {
    logger.error('API Error', { meta })
  } else if (status >= 400) {
    logger.warn('API Warning', { meta })
  } else {
    logger.info('API Access', { meta })
  }

  return null
})
