import { HTTPSTATUS } from '@/config/http.config'
import asyncHandler from '@/middleware/asyncHandler.middleware'
import { Request, Response } from 'express'
import { Package } from './Package.model'
import { validateObjectId } from '@/utils/helper.util'

// ADD PACKAGE
export const addPackage = asyncHandler(async (req: Request, res: Response) => {
  const { packageName, duration, price, features, description } = req.body

  if (!packageName || !packageName.trim()) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'package name is required' })
  }

  if (duration === undefined || duration === null || duration < 1) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'duration must be a positive number (months).' })
  }
  if (price === undefined || price === null || price < 0) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'price must be non-negative' })
  }

  const existing = await Package.findOne({
    packageName: packageName.trim(),
    isActive: true
  }).lean()

  if (existing) {
    return res
      .status(HTTPSTATUS.CONFLICT)
      .json({ success: false, error: 'package already existed.' })
  }

  await Package.create({
    packageName: packageName.trim(),
    duration,
    price,
    features: features || [],
    description: description || undefined
  })

  res.status(HTTPSTATUS.CREATED).json({ success: true, message: 'package added' })
})

// GET PACKAGES
export const getPackages = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.user as { role: string }
  const filter: Record<string, any> = {}

  if (role === 'member') {
    filter.isActive = 'active'
  }

  const packages = await Package.find(filter).sort({ createdAt: -1 }).lean()

  res.status(HTTPSTATUS.OK).json({ success: true, message: 'packages fetched', data: packages })
})

// GET PACKAGE
export const getPackage = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }
  if (!_id) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      success: false,
      error: 'package id is required'
    })
  }
  validateObjectId(_id)

  const fetchedPackage = await Package.findById(_id).lean()
  if (!fetchedPackage) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'package not found' })
  }

  res
    .status(HTTPSTATUS.OK)
    .json({ success: true, message: 'package fetched', data: fetchedPackage })
})

// UPDATE PACKAGES
export const updatePackage = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }
  if (!_id) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'package id is required' })
  }
  validateObjectId(_id)

  const existing = await Package.findById(_id).lean()
  if (!existing) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'package not found' })
  }

  const allowedFields = [
    'packageName',
    'duration',
    'price',
    'features',
    'description',
    'isActive'
  ] as const

  const updateData: Record<string, any> = {}
  for (const field of allowedFields) {
    if (!(field in req.body)) continue
    const reqData = req.body[field]
    const existingData = existing[field]

    if (reqData !== existingData) {
      updateData[field] = reqData
    }
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(HTTPSTATUS.OK).json({ success: true, message: 'no changes detected' })
  }

  await Package.findByIdAndUpdate(_id, updateData, { new: true })

  res.status(HTTPSTATUS.OK).json({ success: true, message: 'package updated' })
})

// DELETE PACKAGE
export const deletePackage = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }
  if (!_id) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'package id is required' })
  }
  validateObjectId(_id, 'package id')

  await Package.findByIdAndUpdate(_id, { isActive: false }, { new: true })
  res.status(HTTPSTATUS.OK).json({ success: true, message: 'package is deactivated' })
})

export const getPackagesList = asyncHandler(async (req: Request, res: Response) => {
  const packages = await Package.find()
    .select('_id packageName price duration')
    .sort({ createdAt: -1 })
    .lean()

  res.status(HTTPSTATUS.OK).json({ success: true, message: 'packages fetched', data: packages })
})
