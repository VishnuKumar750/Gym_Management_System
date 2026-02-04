import { Request, Response, NextFunction } from 'express'
import { HTTPSTATUS } from '@/config/http.config'
import ApiError from '@/utils/ApiError'
import { UserRole } from '@/types/user.types'

// roles: This will accept allowed roles for each route
export const rbac = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req?.user?.role

    if (!userRole) {
      throw new ApiError('User role missing in token', HTTPSTATUS.UNAUTHORIZED)
    }

    if (!roles.includes(userRole)) {
      throw new ApiError('Access denied: Insufficient permissions', HTTPSTATUS.FORBIDDEN)
    }

    next()
  }
}
