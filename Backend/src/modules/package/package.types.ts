import { Document, Types } from 'mongoose'

// ---------------------------------------------------------------------------
// Mongoose document shape (mirrors the schema exactly)
// ---------------------------------------------------------------------------

export interface IPackageDocument extends Document {
  _id: Types.ObjectId
  packageName: string
  duration: number // months
  price: number
  features: string[]
  description?: string
  isActive: boolean
  createdAt: Date
}

/**
 * Lean version — what .lean() returns (no mongoose methods, plain object).
 * Used as return types from the service so controllers never touch mongoose
 * documents directly.
 */
export type IPackageLean = Omit<IPackageDocument, keyof Document> & {
  _id: Types.ObjectId
}

// ---------------------------------------------------------------------------
// Request-body DTOs
// ---------------------------------------------------------------------------

export interface CreatePackageBody {
  packageName: string
  duration: number
  price: number
  features?: string[]
  description?: string
  // isActive is NOT accepted from the client on create — defaults server-side
}

export interface UpdatePackageBody {
  packageName?: string
  duration?: number
  price?: number
  features?: string[]
  description?: string
  isActive?: boolean // admin can toggle active status on update
}

// ---------------------------------------------------------------------------
// Service-layer parameter objects
// ---------------------------------------------------------------------------

export interface CreatePackageParams {
  packageName: string
  duration: number
  price: number
  features: string[]
  description: string | undefined
}

export interface UpdatePackageParams {
  packageName?: string
  duration?: number
  price?: number
  features?: string[]
  description?: string
  isActive?: boolean
}

export interface GetAllPackagesParams {
  includeInactive?: boolean // only admins pass true
}

// ---------------------------------------------------------------------------
// Express augmentation — makes req.user available project-wide
// ---------------------------------------------------------------------------

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: 'admin' | 'staff' | 'member'
        memberId?: string
      }
    }
  }
}

// Force this file to be a module (needed for global augmentation)
export {}
