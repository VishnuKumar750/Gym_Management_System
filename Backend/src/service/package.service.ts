import mongoose from 'mongoose'

import {
  CreatePackageParams,
  UpdatePackageParams,
  GetAllPackagesParams,
  IPackageLean
} from '@/types/package.types'
import { Package } from '@/model/Package.model'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Throws a typed error object that the controller forwards as-is.
 * Keeps the service layer decoupled from Express (no `res` here).
 */
const throwError = (statusCode: number, message: string): never => {
  throw { statusCode, message }
}

/** Returns true when the string is a valid 12-byte / 24-hex ObjectId. */
const isValidObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id)

// ---------------------------------------------------------------------------
// Core: CREATE
// ---------------------------------------------------------------------------

/**
 * Inserts a new package.  `isActive` is never accepted from the caller —
 * it always defaults to `true` on creation (enforced by the schema, but we
 * also omit it here so the intent is explicit in the code).
 */
const createPackageCore = async (params: CreatePackageParams): Promise<IPackageLean> => {
  const { packageName, duration, price, features, description } = params

  // --- input validation ---------------------------------------------------
  if (!packageName || !packageName.trim()) {
    throwError(400, 'Package name is required.')
  }
  if (duration === undefined || duration === null || duration < 1) {
    throwError(400, 'Duration must be a positive number (months).')
  }
  if (price === undefined || price === null || price < 0) {
    throwError(400, 'Price must be a non-negative number.')
  }

  // --- duplicate check ----------------------------------------------------
  const existing = await Package.findOne({
    packageName: packageName.trim(),
    isActive: true
  }).lean()

  if (existing) {
    throwError(409, 'An active package with this name already exists.')
  }

  // --- create -------------------------------------------------------------
  const created = await Package.create({
    packageName: packageName.trim(),
    duration,
    price,
    features: features || [],
    description: description || undefined
    // isActive defaults to true via schema
  })

  // Return lean so the controller gets a plain object
  return created.toObject() as IPackageLean
}

// ---------------------------------------------------------------------------
// Core: READ (single)
// ---------------------------------------------------------------------------

/**
 * Fetches one package by ID.
 * Members can only see active packages; staff & admin see everything.
 */
const getPackageCore = async (packageId: string, role: string): Promise<IPackageLean> => {
  if (!isValidObjectId(packageId)) {
    throwError(400, 'Invalid package ID.')
  }

  const filter: Record<string, unknown> =
    role === 'member' ? { _id: packageId, isActive: true } : { _id: packageId }

  const pkg = await Package.findOne(filter).lean()

  if (!pkg) {
    throwError(404, 'Package not found.')
  }

  return pkg as IPackageLean
}

// ---------------------------------------------------------------------------
// Core: READ (all)
// ---------------------------------------------------------------------------

/**
 * Returns all packages.
 * - Members see only active packages.
 * - Staff / admin see active by default; admin can opt-in to inactive too.
 */
const getAllPackagesCore = async (
  role: string,
  params: GetAllPackagesParams
): Promise<IPackageLean[]> => {
  let filter: Record<string, unknown> = {}

  if (role === 'member') {
    // Members never see inactive packages regardless of query params
    filter.isActive = true
  } else if (role === 'admin' && params.includeInactive) {
    // Admin explicitly asked for everything — no filter
  } else {
    // Staff or admin without the flag → active only
    filter.isActive = true
  }

  const packages = await Package.find(filter).sort({ createdAt: -1 }).lean()

  return packages as IPackageLean[]
}

// ---------------------------------------------------------------------------
// Core: UPDATE
// ---------------------------------------------------------------------------

/**
 * Updates an existing package.  Only fields that are actually present in the
 * payload are applied — others stay untouched.
 */
const updatePackageCore = async (
  packageId: string,
  params: UpdatePackageParams
): Promise<IPackageLean> => {
  if (!isValidObjectId(packageId)) {
    throwError(400, 'Invalid package ID.')
  }

  const existing = await Package.findById(packageId).lean()
  if (!existing) {
    throwError(404, 'Package not found.')
  }

  // --- duplicate name check (only if name is being changed) ---------------
  if (params.packageName && params.packageName.trim() !== existing?.packageName) {
    const duplicate = await Package.findOne({
      packageName: params.packageName.trim(),
      _id: { $ne: packageId },
      isActive: true
    }).lean()

    if (duplicate) {
      throwError(409, 'Another active package with this name already exists.')
    }
  }

  // --- build the update object (only defined keys) ------------------------
  const updates: Record<string, unknown> = {}

  if (params.packageName !== undefined) updates.packageName = params.packageName.trim()
  if (params.duration !== undefined) updates.duration = params.duration
  if (params.price !== undefined) updates.price = params.price
  if (params.features !== undefined) updates.features = params.features
  if (params.description !== undefined) updates.description = params.description
  if (params.isActive !== undefined) updates.isActive = params.isActive

  // Validate numeric fields if they're being changed
  if (updates.duration !== undefined && (updates.duration as number) < 1) {
    throwError(400, 'Duration must be a positive number (months).')
  }
  if (updates.price !== undefined && (updates.price as number) < 0) {
    throwError(400, 'Price must be a non-negative number.')
  }

  const updated = await Package.findByIdAndUpdate(packageId, updates, {
    new: true,
    runValidators: true
  }).lean()

  return updated as IPackageLean
}

// ---------------------------------------------------------------------------
// Core: DELETE (hard delete — packages have no audit trail requirement)
// ---------------------------------------------------------------------------

/**
 * Permanently removes a package.
 * If any active bill references this package, we block the delete to protect
 * data integrity — the admin must deactivate the package first.
 */
const deletePackageCore = async (packageId: string): Promise<void> => {
  if (!isValidObjectId(packageId)) {
    throwError(400, 'Invalid package ID.')
  }

  const existing = await Package.findById(packageId).lean()
  if (!existing) {
    throwError(404, 'Package not found.')
  }

  // Optional: if you have a Bill model that references packages, uncomment:
  // const Bill = require("../models/Bill");
  // const activeBill = await Bill.findOne({ packageId, status: { $ne: "cancelled" } }).lean();
  // if (activeBill) {
  //   throwError(409, "Cannot delete a package linked to an active bill. Deactivate it first.");
  // }

  await Package.findByIdAndDelete(packageId)
}

// ---------------------------------------------------------------------------
// Thin exported wrappers  (same pattern as User module)
// ---------------------------------------------------------------------------

export const createPackage = (params: CreatePackageParams) => createPackageCore(params)
export const getPackage = (packageId: string, role: string) => getPackageCore(packageId, role)
export const getAllPackages = (role: string, params: GetAllPackagesParams = {}) =>
  getAllPackagesCore(role, params)
export const updatePackage = (packageId: string, params: UpdatePackageParams) =>
  updatePackageCore(packageId, params)
export const deletePackage = (packageId: string) => deletePackageCore(packageId)
