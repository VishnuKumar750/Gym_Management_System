import { Types } from 'mongoose'
import ApiError from '@/utils/ApiError'
import User from '@/model/user.model'
import { HTTPSTATUS } from '@/config/http.config'
import { signToken } from '@/utils/jwt.utils'

interface Signin {
  email: string
  password: string
}

// validation
const validateEmail = async (email: string) => {
  // check email is valid or not
  const user = await User.findOne({ email })
  if (!user) throw new ApiError('email not exists', HTTPSTATUS.NOT_FOUND)

  return user
}

// sanitize object
const sanitizeUser = (user: any) => {
  if (!user) return null

  const obj = user.toObject ? user.toObject() : user

  delete obj.password
  delete obj.__v

  return obj
}

// signin
export const signin = async (data: Signin) => {
  // check if email is valid or not
  const user = await validateEmail(data.email)

  // compare password
  const match = await user.comparePassword(data.password)
  if (!match) throw new ApiError('invalid password', HTTPSTATUS.NOT_FOUND)

  const token = signToken({ id: user._id.toString(), role: user.role })

  const result = sanitizeUser(user)

  return {
    token,
    data: result
  }
}

type ID = {
  id: Types.ObjectId | string
}
// me
export const getMeService = async (userId: ID) => {
  const user = await User.findById({ _id: userId }).select('-password -__v')

  if (!user) {
    throw new ApiError('User not found', HTTPSTATUS.NOT_FOUND)
  }

  return user
}
