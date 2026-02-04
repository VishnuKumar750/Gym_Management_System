import { Request, Response } from 'express'
import asyncHandler from '@/middleware/asyncHandler.middleware'
import * as DietPlanService from '@/service/dietPlan.service'

// CREATE
export const createDietPlanController = asyncHandler(async (req: Request, res: Response) => {
  const result = await DietPlanService.createDietPlan({
    ...req.body,
    createdBy: req.user?.id
  })
  res.status(201).json(result)
})

// GET ALL (ADMIN)
export const getAllDietPlansController = asyncHandler(async (_req: Request, res: Response) => {
  const result = await DietPlanService.getAllDietPlans()
  res.status(200).json(result)
})

// GET MEMBER PLANS
export const getMemberDietPlansController = asyncHandler(async (req: Request, res: Response) => {
  const memberId = req.params.memberId || req.user?.id
  const result = await DietPlanService.getMemberDietPlans(memberId)
  res.status(200).json(result)
})

// GET SINGLE
export const getDietPlanController = asyncHandler(async (req: Request, res: Response) => {
  const result = await DietPlanService.getDietPlanById(req.params.dietPlanId)
  res.status(200).json(result)
})

// UPDATE
export const updateDietPlanController = asyncHandler(async (req: Request, res: Response) => {
  const result = await DietPlanService.updateDietPlan(req.params.dietPlanId, req.body)
  res.status(200).json(result)
})

// DELETE
export const deleteDietPlanController = asyncHandler(async (req: Request, res: Response) => {
  const result = await DietPlanService.deleteDietPlan(req.params.dietPlanId)
  res.status(200).json(result)
})
