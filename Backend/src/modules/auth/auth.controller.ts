import { Request, Response } from 'express'
import asyncHandler from '@/middleware/asyncHandler.middleware'
import { HTTPSTATUS } from '@/config/http.config'
import { validateObjectId } from '@/utils/helper.util'
import User from '../user/user.model'
import { signToken } from '@/utils/jwt.utils'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

// signin controller
export const signincontroller = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (typeof email !== 'string' || !email.trim() || !EMAIL_REGEX.test(email)) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'invalid email format' })
  }
  if (
    typeof password !== 'string' ||
    !password.trim() ||
    password.length < 6 ||
    !PASSWORD_REGEX.test(password)
  ) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      success: false,
      error: 'Password must be at least 6 characters and include upper, lower, number, and symbol'
    })
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return res.status(HTTPSTATUS.UNAUTHORIZED).json({
      success: false,
      error: 'Invalid email'
    })
  }

  if (user.status !== 'active') {
    return res.status(HTTPSTATUS.FORBIDDEN).json({
      success: false,
      error: 'Account is not active'
    })
  }

  const isMatched = await user.comparePassword(password)
  if (!isMatched) {
    return res.status(HTTPSTATUS.UNAUTHORIZED).json({
      success: false,
      error: 'Invalid password'
    })
  }
  const token = signToken({ id: user._id.toString(), role: user.role })

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 3 * 24 * 60 * 60 * 1000
  })

  res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'signin successful',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  })
})

// GET /api/auth/me
export const refreshLogin = async (req: Request, res: Response) => {
  const { id } = req.user as { id: string }
  if (!id) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ success: false, error: 'user id is required' })
  }
  validateObjectId(id)
  const user = await User.findById({ _id: id }).select('_id name email role')
  if (!user) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'user not found' })
  }

  res.status(HTTPSTATUS.OK).json({
    success: true,
    user
  })
}

// POST /api/auth/logout
export const logout = async (req: Request, res: Response) => {
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
