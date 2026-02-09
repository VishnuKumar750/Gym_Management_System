import { Request, Response } from 'express'
import asyncHandler from '@/middleware/asyncHandler.middleware'
import { HTTPSTATUS } from '@/config/http.config'
import { validateObjectId } from '@/utils/helper.util'
import { Supplement } from './supplement.model'

// ADD SUPPLEMENT
export const addSupplement = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user as { id?: string }
  if (!id) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'admin id is required' })
  }
  validateObjectId(id)

  const { productName, category, brand, description, price, stockQuantity, unit, imageUrl } =
    req.body
  if (
    typeof productName !== 'string' ||
    !productName.trim() ||
    typeof category !== 'string' ||
    !category.trim() ||
    typeof unit !== 'string' ||
    !unit.trim() ||
    typeof price !== 'number' ||
    price <= 0
  ) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      success: false,
      error: 'Invalid supplement data'
    })
  }

  if (stockQuantity !== undefined && stockQuantity < 0) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      success: false,
      error: 'Stock quantity cannot be negative'
    })
  }

  const supplement = await Supplement.create({
    productName: productName.trim(),
    category: category.trim(),
    brand: brand?.trim(),
    description: description?.trim(),
    price,
    stockQuantity: stockQuantity ?? 0,
    unit,
    imageUrl,
    createdBy: id
  })

  return res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: 'Supplement added successfully',
    data: supplement
  })
})

// UPDATE SUPPLEMENT
export const updateSupplement = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }
  if (!_id) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'supplement id is required' })
  }
  validateObjectId(_id)

  const existing = await Supplement.findById(_id)
  if (!existing) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'supplement not found' })
  }

  const allowedFields = ['price', 'stockQuantity', 'unit'] as const
  const updateData: Record<string, any> = {}
  for (const field of allowedFields) {
    if (!(field in req.body)) continue

    let reqData = req.body[field]
    let existingData = existing[field]

    if (reqData !== existingData) {
      updateData[field] = reqData
    }
  }

  await Supplement.findByIdAndUpdate(_id, updateData, { new: true })
  res.status(HTTPSTATUS.OK).json({ success: true, message: 'supplement updated' })
})

// GET SUPPLEMENTS
export const getSupplements = asyncHandler(async (req: Request, res: Response) => {
  const { search, sort, isAvailable } = req.query as {
    search?: string
    sort?: string
    isAvailable?: string
  }

  const filter: Record<string, any> = {}

  // Text search (name / title)
  if (search) {
    filter.productName = { $regex: search, $options: 'i' }
  }

  // Availability filter
  if (isAvailable !== undefined) {
    filter.isAvailable = isAvailable === 'true'
  }

  // Sorting
  const sortOrder: 1 | -1 = sort === '1' ? 1 : -1
  const supplements = await Supplement.find(filter).sort({ createdAt: sortOrder }).lean()

  res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'supplements fetched',
    data: supplements
  })
})

// GET SUPPLEMENT
export const getSupplement = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }
  if (!_id) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'supplement id is required' })
  }
  validateObjectId(_id)

  const supplement = await Supplement.findById({ _id: _id })
  if (!supplement) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'supplment not found' })
  }

  const data = {
    _id: supplement._id,
    price: supplement.price,
    stockQuantity: supplement.stockQuantity,
    unit: supplement.unit,
    productName: supplement.productName
  }

  res.status(HTTPSTATUS.OK).json({ success: true, message: 'supplment details', data })
})

// DELETE SUPPLEMENT
export const deleteSupplement = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }
  if (!_id) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'supplement id is required' })
  }
  validateObjectId(_id)

  await Supplement.findByIdAndDelete({ _id: _id })
  res.status(HTTPSTATUS.OK).json({ success: true, message: 'supplement deleted' })
})
