import { Request, Response, NextFunction } from 'express'

import {
  createPackage,
  getPackage,
  getAllPackages,
  updatePackage,
  deletePackage
} from '@/service/package.service'

import { CreatePackageBody, UpdatePackageBody } from '@/types/package.types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Wraps an async controller so uncaught rejections flow to Express's error
 * handler instead of hanging the request.
 */
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next)

/**
 * Forwards structured errors from the service layer.
 * If the error has a statusCode we trust it; otherwise it's unexpected and
 * we let the global error handler deal with it via next().
 */
const handleError = (error: unknown, res: Response, next: NextFunction): void => {
  if (typeof error === 'object' && error !== null && 'statusCode' in error && 'message' in error) {
    res.status(error.statusCode as number).json({
      success: false,
      message: error.message as string
    })
    return
  }
  next(error) // unexpected — let global handler respond
}

// ---------------------------------------------------------------------------
// CREATE  –  POST /api/packages
// ---------------------------------------------------------------------------

export const createPackageController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract only the fields the service expects.
    // isActive, createdAt, _id are NEVER read from the body.
    const { packageName, duration, price, features, description } = req.body as CreatePackageBody

    const pkg = await createPackage({
      packageName,
      duration,
      price,
      features: features ?? [],
      description
    })

    res.status(201).json({
      success: true,
      message: 'Package created successfully.',
      data: pkg
    })
  }
)

// ---------------------------------------------------------------------------
// GET ALL  –  GET /api/packages
// ---------------------------------------------------------------------------

export const getAllPackagesController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = req.user!.role

      // Only admin can request inactive packages via ?includeInactive=true
      const includeInactive = role === 'admin' && req.query.includeInactive === 'true'

      const packages = await getAllPackages(role, { includeInactive })

      res.status(200).json({
        success: true,
        message: 'Packages fetched successfully.',
        data: { packages }
      })
    } catch (error) {
      handleError(error, res, next)
    }
  }
)

// ---------------------------------------------------------------------------
// GET SINGLE  –  GET /api/packages/:packageId
// ---------------------------------------------------------------------------

export const getPackageController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { packageId } = req.params
      const role = req.user!.role

      const pkg = await getPackage(packageId, role)

      res.status(200).json({
        success: true,
        message: 'Package fetched successfully.',
        data: { package: pkg }
      })
    } catch (error) {
      handleError(error, res, next)
    }
  }
)

// ---------------------------------------------------------------------------
// UPDATE  –  PUT /api/packages/:packageId
// ---------------------------------------------------------------------------

export const updatePackageController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { packageId } = req.params

      // Extract only whitelisted update fields
      const { packageName, duration, price, features, description, isActive } =
        req.body as UpdatePackageBody

      const pkg = await updatePackage(packageId, {
        packageName,
        duration,
        price,
        features,
        description,
        isActive
      })

      res.status(200).json({
        success: true,
        message: 'Package updated successfully.',
        data: { package: pkg }
      })
    } catch (error) {
      handleError(error, res, next)
    }
  }
)

// ---------------------------------------------------------------------------
// DELETE  –  DELETE /api/packages/:packageId
// ---------------------------------------------------------------------------

export const deletePackageController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { packageId } = req.params

      await deletePackage(packageId)

      res.status(200).json({
        success: true,
        message: 'Package deleted successfully.'
      })
    } catch (error) {
      handleError(error, res, next)
    }
  }
)
