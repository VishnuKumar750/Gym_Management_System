import { Types } from 'mongoose'
import ApiError from './ApiError'
import { HTTPSTATUS } from '@/config/http.config'

// HELPER FUNCTION TO VALIDATE MONGOOSE ID
export const validateObjectId = (id: string, label: string = 'ID'): void => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(`Invalid ${label}`, HTTPSTATUS.BAD_REQUEST)
  }
}

// GENERATE MEMBER ID
export const generateMemberId = () => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `MEM-${timestamp}-${random}`
}

// MEMBER STATUS VALIDATOR
export const validateMemberStatus = (status: string) => {
  if (status !== 'active' && status !== 'inactive' && status !== 'suspended') {
    return false
  }
  return true
}

// compute final Amount
export const computeFinalAmount = (amount: number, discount: number, taxAmount: number) => {
  const final = amount - discount + taxAmount
  return final
}

export const generateBillNumber = () => {
  const now = new Date()
  const date = `${now.getFullYear()}${String(now.getMonth() - 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `Bill-${date}-${random}`
}
