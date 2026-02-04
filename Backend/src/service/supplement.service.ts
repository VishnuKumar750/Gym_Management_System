import { Types } from 'mongoose'
import { Supplement } from '@/model/supplement.model'
import ApiError from '@/utils/ApiError'
import { HTTPSTATUS } from '@/config/http.config'

// helpers
const validateObjectId = (id: string, name = 'ID') => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(`Invalid ${name}`, HTTPSTATUS.BAD_REQUEST)
  }
}

// CREATE SUPPLEMENT (ADMIN)
export const createSupplement = async (data: any) => {
  const supplement = await Supplement.create(data)

  return {
    success: true,
    message: 'Supplement created successfully',
    data: supplement
  }
}

// GET ALL SUPPLEMENTS (ADMIN + MEMBER)
export const getSupplements = async () => {
  const supplements = await Supplement.find().sort({ createdAt: -1 }).lean()

  return {
    success: true,
    message: supplements.length ? 'Supplements retrieved successfully' : 'No supplements found',
    data: supplements
  }
}

// GET SINGLE SUPPLEMENT
export const getSupplementById = async (supplementId: string) => {
  validateObjectId(supplementId, 'Supplement ID')

  const supplement = await Supplement.findById(supplementId).lean()

  if (!supplement) {
    throw new ApiError('Supplement not found', HTTPSTATUS.NOT_FOUND)
  }

  return {
    success: true,
    message: 'Supplement retrieved successfully',
    data: supplement
  }
}

// UPDATE SUPPLEMENT (ADMIN)
export const updateSupplement = async (supplementId: string, data: any) => {
  validateObjectId(supplementId, 'Supplement ID')

  const supplement = await Supplement.findByIdAndUpdate(
    supplementId,
    { $set: data },
    { new: true }
  ).lean()

  if (!supplement) {
    throw new ApiError('Supplement not found', HTTPSTATUS.NOT_FOUND)
  }

  return {
    success: true,
    message: 'Supplement updated successfully',
    data: supplement
  }
}

// DELETE SUPPLEMENT (ADMIN)
export const deleteSupplement = async (supplementId: string) => {
  validateObjectId(supplementId, 'Supplement ID')

  const supplement = await Supplement.findByIdAndDelete(supplementId).lean()

  if (!supplement) {
    throw new ApiError('Supplement not found', HTTPSTATUS.NOT_FOUND)
  }

  return {
    success: true,
    message: 'Supplement deleted successfully',
    data: { deletedId: supplementId }
  }
}
