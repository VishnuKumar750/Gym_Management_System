import { Request, Response } from 'express'
import asyncHandler from '@/middleware/asyncHandler.middleware'
import * as SupplementService from '@/service/supplement.service'

// CREATE
export const createSupplementController = asyncHandler(async (req: Request, res: Response) => {
  const result = await SupplementService.createSupplement(req.body)
  res.status(201).json(result)
})

// GET ALL
export const getSupplementsController = asyncHandler(async (_req: Request, res: Response) => {
  const result = await SupplementService.getSupplements()
  res.status(200).json(result)
})

// GET SINGLE
export const getSupplementController = asyncHandler(async (req: Request, res: Response) => {
  const result = await SupplementService.getSupplementById(req.params.supplementId)
  res.status(200).json(result)
})

// UPDATE
export const updateSupplementController = asyncHandler(async (req: Request, res: Response) => {
  const result = await SupplementService.updateSupplement(req.params.supplementId, req.body)
  res.status(200).json(result)
})

// DELETE
export const deleteSupplementController = asyncHandler(async (req: Request, res: Response) => {
  const result = await SupplementService.deleteSupplement(req.params.supplementId)
  res.status(200).json(result)
})
