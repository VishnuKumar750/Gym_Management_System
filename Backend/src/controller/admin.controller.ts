import { Request, Response, NextFunction } from 'express'
import {
  createMember,
  updateMember,
  deleteMember,
  getAllMembers,
  getMember,
  createStaff,
  updateStaff,
  deleteStaff,
  getAllStaffs,
  getStaff,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAllAdmins,
  getAdmin,
  getAdminAnalytics,
  getStaffMemberAnalytics
} from '@/service/admin.services'
import { HTTPSTATUS } from '@/config/http.config'
import asyncHandler from '@/middleware/asyncHandler.middleware'
import ApiError from '@/utils/ApiError'

// ============================================
// MEMBER CONTROLLERS
// ============================================

export const createMemberController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createMember(req.body)
    res.status(HTTPSTATUS.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

export const updateMemberController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateMember(req.params.id, req.body)
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const deleteMemberController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deleteMember(req.params.id)
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const getAllMembersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      status: req.query.status as string | undefined,
      gender: req.query.gender as string | undefined,
      search: req.query.search as string | undefined
    }
    const result = await getAllMembers(filters)
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const getMemberController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getMember(req.params.id)
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}

// ============================================
// STAFF CONTROLLERS
// ============================================

export const createStaffController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createStaff(req.body)
    res.status(HTTPSTATUS.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

export const updateStaffController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateStaff(req.params.id, req.body)
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const deleteStaffController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deleteStaff(req.params.id)
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const getAllStaffsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      status: req.query.status as string | undefined,
      gender: req.query.gender as string | undefined,
      search: req.query.search as string | undefined
    }
    const result = await getAllStaffs(filters)
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const getStaffController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getStaff(req.params.id)
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}

// ============================================
// ADMIN CONTROLLERS
// ============================================

export const createAdminController = asyncHandler(async (req: Request, res: Response) => {
  const result = await createAdmin(req.body)
  res.status(HTTPSTATUS.CREATED).json(result)
})

export const updateAdminController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateAdmin(req.params.id, req.body)
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const deleteAdminController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deleteAdmin(req.params.id)
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const getAllAdminsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      status: req.query.status as string | undefined,
      gender: req.query.gender as string | undefined,
      search: req.query.search as string | undefined
    }
    const result = await getAllAdmins(filters)
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const getAdminController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAdmin(req.params.id)
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const getAdminAnalyticsController = async (req, res) => {
  const data = await getAdminAnalytics()
  res.status(200).json(data)
}

export const getStaffAnalyticsController = async (req: Request, res: Response) => {
  const staffId = req.user?.id

  if (!staffId) {
    throw new ApiError('Unauthorized', HTTPSTATUS.UNAUTHORIZED)
  }

  const analytics = await getStaffMemberAnalytics(staffId)

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: analytics
  })
}
