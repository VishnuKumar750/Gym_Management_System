import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import { config } from '../config/app.config'
import { HTTPSTATUS } from '../config/http.config'
import ApiError from './ApiError'

export interface IJWTPayload extends JwtPayload {
  id: string
  role: string
}

export const signToken = (payload: IJWTPayload, options: SignOptions = {}): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES,
    ...options
  })
}

export const jwtVerify = (token: string): IJWTPayload => {
  if (!token) {
    throw new ApiError('token is missing', HTTPSTATUS.NOT_FOUND)
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as IJWTPayload
    return decoded
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError('Token has expired', HTTPSTATUS.NOT_FOUND)
    }

    if (error.name === 'JsonWebTokenError') {
      throw new ApiError('Invalid token', HTTPSTATUS.UNAUTHORIZED)
    }

    throw new ApiError('Token verification failed', HTTPSTATUS.INTERNAL_SERVER_ERROR)
  }
}
