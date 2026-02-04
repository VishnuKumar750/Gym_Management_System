import asyncHandler from '@/middleware/asyncHandler.middleware'
import { Request, Response } from 'express'
import { getMeService, signin } from '@/service/auth.service'
import { HTTPSTATUS } from '@/config/http.config'

// signin controller
export const signincontroller = asyncHandler(async (req: Request, res: Response) => {
  const { token, data } = await signin(req.body)

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 3 * 24 * 60 * 60 * 1000
  })

  res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'signin successful',
    user: data
  })
})

// GET /api/auth/me
export const getMe = async (req: Request, res: Response) => {
  const user = await getMeService(req.user?.id)

  res.status(HTTPSTATUS.OK).json({
    success: true,
    user
  })
}

// POST /api/auth/logout
export const logout = async (_req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production'
  })

  res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'Logged out successfully'
  })
}
