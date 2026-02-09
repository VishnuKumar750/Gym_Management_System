import { Request, Response } from 'express'
import asyncHandler from '@/middleware/asyncHandler.middleware'
import { HTTPSTATUS } from '@/config/http.config'
import { validateMemberStatus, validateObjectId } from '@/utils/helper.util'
import { DietPlan } from '@/modules/diet/diet.model'
import User from '../user/user.model'

// ADD DIETS
export const addDiet = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }

  if (!_id) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ success: false, error: 'id is required' })
  }
  validateObjectId(_id)

  const user = await User.exists({ _id })
  if (!user) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ success: false, error: 'user must be logged in' })
  }

  const { planName, goal, calories, notes } = req.body
  if (
    typeof planName !== 'string' ||
    !planName.trim() ||
    typeof goal !== 'string' ||
    typeof calories !== 'object' ||
    typeof notes !== 'string'
  ) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'all fields must be filled' })
  }

  await DietPlan.create({
    ...req.body,
    member: _id,
    createdBy: req.user?.id
  })

  res.status(HTTPSTATUS.CREATED).json({ success: true, message: 'diet created successfully' })
})

//  GET DIETS
export const getDiets = asyncHandler(async (req: Request, res: Response) => {
  const { isActive } = req.query as { isActive?: string }

  const diets = await DietPlan.find()
    .populate('member', '_id name email memberId')
    .populate('createdBy', '_id name email')
    .sort({ createdAt: -1 })
    .lean()

  return res.status(HTTPSTATUS.OK).json({ success: true, message: 'diet plans', data: diets })
})

// GET MEMBER DIET
export const getMemberDiets = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }
  const { status, isActive } = req.query as { status?: string; isActive?: string }
  if (!_id) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'membe id is required' })
  }
  validateObjectId(_id)

  const query: Record<string, any> = {}
  if (status) {
    if (validateMemberStatus(status)) {
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ success: false, error: 'query must be valid' })
    } else {
      query.status = status
    }
  }

  query.member = _id

  if (isActive) {
    query.isActive = false
  } else {
    query.isActive = true
  }

  const exists = await User.exists({ _id, status })
  if (!exists) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'member not found' })
  }

  const diet = await DietPlan.findOne(query).lean()
  if (!diet) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'diet not found' })
  }

  res.status(HTTPSTATUS.OK).json({ success: true, message: 'diet fetched', data: diet })
})

// GET DIET
export const getDiet = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }
  if (!_id) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ success: false, error: 'diet is required' })
  }
  validateObjectId(_id)

  const diet = await DietPlan.findById(_id).lean()
  if (!diet) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'diet not found' })
  }

  res.status(HTTPSTATUS.OK).json({ success: true, message: 'diet details', data: diet })
})

// UPDATE DIET
export const updateDiet = asyncHandler(async (req: Request, res: Response) => {
  const { _id, memberId } = req.query as { _id: string; memberId: string }
  const updatorId = req.user?.id

  validateObjectId(_id)
  validateObjectId(memberId)

  const exists = await User.exists({ _id: memberId })
  if (!exists) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'member not found' })
  }

  const diet = await DietPlan.findById(_id)
  if (!diet) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'diet not found' })
  }

  const allowedFields = ['planName', 'goal', 'calories', 'meals', 'notes', 'isActive'] as const
  const { planName, goal, calories, meals, notes, isActive } = req.body
  const updateData: Record<string, any> = {
    createdBy: updatorId
  }
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      const req_data = req.body[field]
      const existing = diet[field]

      const isMatched =
        typeof req_data === 'object'
          ? JSON.stringify(req_data) === JSON.stringify(existing)
          : req_data === existing
      if (isMatched) {
        updateData[field] = req.body[field]
      }
    }
  }

  if (!Object.keys(updateData).length) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ success: false, message: 'nothing to update' })
  }

  const updatedDiet = await DietPlan.findOneAndUpdate(
    { _id: _id, member: memberId },
    { $set: updateData },
    { new: true, runValidators: true }
  )

  if (!updatedDiet) {
    return res
      .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: 'update diet failed' })
  }

  res.status(HTTPSTATUS.OK).json({ success: true, message: 'diet updated0' })
})

// DELETE DIET
export const deleteDiet = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.query as { _id?: string }
  if (!_id)
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ success: false, error: '_id is required' })
  validateObjectId(_id)

  const diet = await DietPlan.findByIdAndDelete(_id)
  if (!diet) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'diet not found' })
  }

  res.status(HTTPSTATUS.OK).json({ success: true, message: 'diet deleted' })
})
