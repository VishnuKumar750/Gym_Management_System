import { Types } from 'mongoose'
import { DietPlan } from '@/model/diet.model'
import User from '@/model/user.model'
import ApiError from '@/utils/ApiError'
import { HTTPSTATUS } from '@/config/http.config'

// helpers
const validateObjectId = (id: string, name = 'ID') => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(`Invalid ${name}`, HTTPSTATUS.BAD_REQUEST)
  }
}

const checkMemberExists = async (memberId: string) => {
  validateObjectId(memberId, 'Member ID')
  const exists = await User.exists({ _id: memberId, role: 'member' })
  if (!exists) {
    throw new ApiError('Member not found', HTTPSTATUS.NOT_FOUND)
  }
}

// CREATE DIET PLAN (ADMIN / TRAINER)
export const createDietPlan = async (data: any) => {
  await checkMemberExists(data.member)

  const dietPlan = await DietPlan.create(data)

  return {
    success: true,
    message: 'Diet plan created successfully',
    data: dietPlan
  }
}

// GET ALL DIET PLANS (ADMIN)
export const getAllDietPlans = async () => {
  const plans = await DietPlan.find()
    .populate('member', 'name email memberId')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .lean()

  return {
    success: true,
    message: plans.length ? 'Diet plans retrieved successfully' : 'No diet plans found',
    data: plans
  }
}

// GET MEMBER DIET PLANS (MEMBER / ADMIN)
export const getMemberDietPlans = async (memberId: string) => {
  await checkMemberExists(memberId)

  const plans = await DietPlan.find({ member: memberId }).sort({ startDate: -1 }).lean()

  return {
    success: true,
    message: plans.length ? 'Diet plans retrieved successfully' : 'No diet plans found',
    data: plans
  }
}

// GET SINGLE DIET PLAN
export const getDietPlanById = async (dietPlanId: string) => {
  validateObjectId(dietPlanId, 'Diet Plan ID')

  const plan = await DietPlan.findById(dietPlanId)
    .populate('member', 'name email memberId')
    .populate('createdBy', 'name email')
    .lean()

  if (!plan) {
    throw new ApiError('Diet plan not found', HTTPSTATUS.NOT_FOUND)
  }

  return {
    success: true,
    message: 'Diet plan retrieved successfully',
    data: plan
  }
}

// UPDATE DIET PLAN (ADMIN / TRAINER)
export const updateDietPlan = async (dietPlanId: string, data: any) => {
  validateObjectId(dietPlanId, 'Diet Plan ID')

  const plan = await DietPlan.findByIdAndUpdate(dietPlanId, { $set: data }, { new: true }).lean()

  if (!plan) {
    throw new ApiError('Diet plan not found', HTTPSTATUS.NOT_FOUND)
  }

  return {
    success: true,
    message: 'Diet plan updated successfully',
    data: plan
  }
}

// DELETE DIET PLAN (ADMIN)
export const deleteDietPlan = async (dietPlanId: string) => {
  validateObjectId(dietPlanId, 'Diet Plan ID')

  const plan = await DietPlan.findByIdAndDelete(dietPlanId).lean()

  if (!plan) {
    throw new ApiError('Diet plan not found', HTTPSTATUS.NOT_FOUND)
  }

  return {
    success: true,
    message: 'Diet plan deleted successfully',
    data: { deletedId: dietPlanId }
  }
}
