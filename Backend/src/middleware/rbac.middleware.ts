import { Request, Response, NextFunction } from 'express'
import { HTTPSTATUS } from '@/config/http.config'
import ApiError from '@/utils/ApiError'

const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
  STAFF: 'staff'
} as const

type Role = (typeof ROLES)[keyof typeof ROLES]

// roles: This will accept allowed roles for each route
export const rbac = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role
    if (!userRole) {
      throw new ApiError('User role missing in token', HTTPSTATUS.UNAUTHORIZED)
    }
    if (!roles.includes(userRole)) {
      throw new ApiError('Access denied', HTTPSTATUS.FORBIDDEN)
    }
    next()
  }
}
