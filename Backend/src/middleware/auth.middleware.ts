import asyncHandler from './asyncHandler.middleware'
import { jwtVerify } from '../utils/jwt.utils'
import { HTTPSTATUS } from '../config/http.config'
import ApiError from '../utils/ApiError'

export const protectRoute = asyncHandler(async (req: any, res, next) => {
  // token from cookies
  const token = req.cookies?.token
  if (!token) {
    throw new ApiError('authnetication required', HTTPSTATUS.UNAUTHORIZED)
  }

  const decoded = jwtVerify(token)

  req.user = decoded
  next()
})
