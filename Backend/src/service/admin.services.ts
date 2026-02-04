import { Types } from 'mongoose'
import ApiError from '@/utils/ApiError'
import { HTTPSTATUS } from '@/config/http.config'
import User from '../model/user.model'
import { Bill } from '../model/bill.model'
import { DietPlan } from '../model/diet.model'
import { Supplement } from '../model/supplement.model'
import { Package } from '../model/Package.model'
import { Notification } from '../model/notification.model'
// ============================================
// TYPES
// ============================================

interface CreateUserPayload {
  name: string
  email: string
  password: string
  phone: string
  memberId?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
  }
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  assignedPackage?: string
}

interface UpdateUserPayload {
  name?: string
  email?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
  }
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  status?: 'active' | 'inactive' | 'suspended'
  assignedPackage?: string
}

interface QueryFilters {
  status?: string
  gender?: string
  search?: string
}

type UserRole = 'admin' | 'staff' | 'trainer' | 'member'

// ============================================
// HELPERS
// ============================================

const validateObjectId = (id: string, label = 'ID'): void => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(`Invalid ${label}`, HTTPSTATUS.BAD_REQUEST)
  }
}

const generateMemberId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `MEM-${timestamp}-${random}`
}

const sanitizeUser = (user: any) => {
  const { password, __v, ...safe } = user
  return safe
}

// ============================================
// CORE: CREATE
// ============================================

const createUserCore = async (payload: CreateUserPayload, role: UserRole) => {
  if (!payload.name || !payload.email || !payload.password || !payload.phone) {
    throw new ApiError('Name, email, password, and phone are required', HTTPSTATUS.BAD_REQUEST)
  }

  const emailExists = await User.exists({ email: payload.email.toLowerCase() })
  if (emailExists) {
    throw new ApiError('Email is already registered', HTTPSTATUS.CONFLICT)
  }

  if (payload.assignedPackage) {
    validateObjectId(payload.assignedPackage, 'Package ID')
  }

  const user = await User.create({
    ...payload,
    role,
    memberId: role === 'member' ? generateMemberId() : undefined
  })

  return sanitizeUser(user.toObject())
}

// ============================================
// CORE: UPDATE
// ============================================

const updateUserCore = async (userId: string, payload: UpdateUserPayload, role: UserRole) => {
  validateObjectId(userId, 'User ID')

  const user = await User.findById(userId).lean()
  if (!user) {
    throw new ApiError('User not found', HTTPSTATUS.NOT_FOUND)
  }

  if (user.role !== role) {
    throw new ApiError(`User is not a ${role}`, HTTPSTATUS.BAD_REQUEST)
  }

  // Email uniqueness check — only if email is actually changing
  if (payload.email && payload.email.toLowerCase() !== user.email) {
    const emailExists = await User.exists({
      email: payload.email.toLowerCase(),
      _id: { $ne: userId }
    })
    if (emailExists) {
      throw new ApiError('Email is already registered', HTTPSTATUS.CONFLICT)
    }
  }
  if (payload.phone && payload.phone.toLowerCase() !== user.phone) {
    const phoneExists = await User.exists({
      phone: payload.phone.toLowerCase(),
      _id: { $ne: userId }
    })
    if (phoneExists) {
      throw new ApiError('Phone is already registered', HTTPSTATUS.CONFLICT)
    }
  }

  if (payload.assignedPackage) {
    validateObjectId(payload.assignedPackage, 'Package ID')
  }

  const updated = await User.findByIdAndUpdate(
    userId,
    { $set: payload },
    { new: true, runValidators: true }
  ).lean()

  return sanitizeUser(updated)
}

// ============================================
// CORE: DELETE (soft delete)
// ============================================

const deleteUserCore = async (userId: string, role: UserRole) => {
  validateObjectId(userId, 'User ID')

  const user = await User.findById(userId).lean()
  if (!user) {
    throw new ApiError('User not found', HTTPSTATUS.NOT_FOUND)
  }

  if (user.role !== role) {
    throw new ApiError(`User is not a ${role}`, HTTPSTATUS.BAD_REQUEST)
  }

  if (user.status === 'inactive') {
    throw new ApiError(`This ${role} is already deactivated`, HTTPSTATUS.CONFLICT)
  }

  await User.findByIdAndUpdate({ _id: userId }, { $set: { status: 'inactive' } })

  return { deletedId: userId, role: user.role, status: 'inactive' }
}

// ============================================
// CORE: GET ALL
// ============================================

const getAllUsersCore = async (role: UserRole, filters: QueryFilters = {}) => {
  const query: any = { role }

  if (filters.status) {
    query.status = filters.status
  }

  if (filters.gender) {
    query.gender = filters.gender
  }

  // Escape regex special chars to prevent injection
  if (filters.search) {
    const escaped = filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escaped, 'i')
    query.$or = [{ name: regex }, { email: regex }, { memberId: regex }]
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password -__v')
      .populate('assignedPackage', 'packageName price duration')
      .sort({ createdAt: -1 })
      .lean(),
    User.countDocuments(query)
  ])

  return { users, total }
}

// ============================================
// CORE: GET SINGLE
// ============================================

const getUserCore = async (userId: string, role: UserRole) => {
  validateObjectId(userId, 'User ID')

  const user = await User.findOne({ _id: userId, role })
    .select('-password -__v')
    .populate('assignedPackage', 'packageName price duration features')
    .lean()

  if (!user) {
    const label = role.charAt(0).toUpperCase() + role.slice(1)
    throw new ApiError(`${label} not found`, HTTPSTATUS.NOT_FOUND)
  }

  return user
}

// ============================================
// MEMBER EXPORTS
// ============================================

export const createMember = async (payload: CreateUserPayload) => {
  const data = await createUserCore(payload, 'member')
  return { success: true, message: 'Member created successfully', data }
}

export const updateMember = async (id: string, payload: UpdateUserPayload) => {
  const data = await updateUserCore(id, payload, 'member')
  return { success: true, message: 'Member updated successfully', data }
}

export const deleteMember = async (id: string) => {
  const data = await deleteUserCore(id, 'member')
  return { success: true, message: 'Member deactivated successfully', data }
}

export const getAllMembers = async (filters: QueryFilters = {}) => {
  const { users, total } = await getAllUsersCore('member', filters)
  return {
    success: true,
    message: total > 0 ? 'Members retrieved successfully' : 'No members found',
    data: { users, total }
  }
}

export const getMember = async (id: string) => {
  const data = await getUserCore(id, 'member')
  return { success: true, message: 'Member retrieved successfully', data }
}

// ============================================
// STAFF EXPORTS
// ============================================

export const createStaff = async (payload: CreateUserPayload) => {
  const data = await createUserCore(payload, 'staff')
  return { success: true, message: 'Staff created successfully', data }
}

export const updateStaff = async (id: string, payload: UpdateUserPayload) => {
  const data = await updateUserCore(id, payload, 'staff')
  return { success: true, message: 'Staff updated successfully', data }
}

export const deleteStaff = async (id: string) => {
  const data = await deleteUserCore(id, 'staff')
  return { success: true, message: 'Staff deactivated successfully', data }
}

export const getAllStaffs = async (filters: QueryFilters = {}) => {
  const { users, total } = await getAllUsersCore('staff', filters)
  return {
    success: true,
    message: total > 0 ? 'Staff retrieved successfully' : 'No staff found',
    data: { users, total }
  }
}

export const getStaff = async (id: string) => {
  const data = await getUserCore(id, 'staff')
  return { success: true, message: 'Staff retrieved successfully', data }
}

// ============================================
// ADMIN EXPORTS
// ============================================

export const createAdmin = async (payload: CreateUserPayload) => {
  const data = await createUserCore(payload, 'admin')
  return { success: true, message: 'Admin created successfully', data }
}

export const updateAdmin = async (id: string, payload: UpdateUserPayload) => {
  const data = await updateUserCore(id, payload, 'admin')
  return { success: true, message: 'Admin updated successfully', data }
}

export const deleteAdmin = async (id: string) => {
  const data = await deleteUserCore(id, 'admin')
  return { success: true, message: 'Admin deactivated successfully', data }
}

export const getAllAdmins = async (filters: QueryFilters = {}) => {
  const { users, total } = await getAllUsersCore('admin', filters)
  return {
    success: true,
    message: total > 0 ? 'Admins retrieved successfully' : 'No admins found',
    data: { users, total }
  }
}

export const getAdmin = async (id: string) => {
  const data = await getUserCore(id, 'admin')
  return { success: true, message: 'Admin retrieved successfully', data }
}

const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
const startOfYear = new Date(new Date().getFullYear(), 0, 1)

/* ----------------------------- SERVICE ----------------------------- */

export const getAdminAnalytics = async () => {
  const [
    userStats,
    supplementStats,
    packageStats,
    notificationStats,
    dietStats,
    billingStats,
    revenueTrends,
    memberGrowth
  ] = await Promise.all([
    /* ---------------- USERS ---------------- */
    User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          members: {
            $sum: { $cond: [{ $eq: ['$role', 'member'] }, 1, 0] }
          },
          staff: {
            $sum: { $cond: [{ $eq: ['$role', 'staff'] }, 1, 0] }
          },
          trainers: {
            $sum: { $cond: [{ $eq: ['$role', 'trainer'] }, 1, 0] }
          }
        }
      }
    ]),

    /* ---------------- SUPPLEMENTS ---------------- */
    Supplement.aggregate([
      {
        $group: {
          _id: null,
          totalSupplements: { $sum: 1 },
          availableSupplements: {
            $sum: { $cond: ['$isAvailable', 1, 0] }
          },
          outOfStock: {
            $sum: { $cond: [{ $lte: ['$stockQuantity', 0] }, 1, 0] }
          }
        }
      }
    ]),

    /* ---------------- PACKAGES ---------------- */
    Package.aggregate([
      {
        $group: {
          _id: null,
          totalPackages: { $sum: 1 },
          activePackages: {
            $sum: { $cond: ['$isActive', 1, 0] }
          }
        }
      }
    ]),

    /* ---------------- NOTIFICATIONS ---------------- */
    Notification.aggregate([
      {
        $group: {
          _id: null,
          totalNotifications: { $sum: 1 },
          sentNotifications: {
            $sum: { $cond: ['$isSent', 1, 0] }
          },
          scheduledNotifications: {
            $sum: {
              $cond: [{ $and: [{ $not: '$isSent' }, { $ne: ['$scheduledDate', null] }] }, 1, 0]
            }
          }
        }
      }
    ]),

    /* ---------------- DIET PLANS ---------------- */
    DietPlan.aggregate([
      {
        $group: {
          _id: null,
          totalDietPlans: { $sum: 1 },
          activeDietPlans: {
            $sum: { $cond: ['$isActive', 1, 0] }
          }
        }
      }
    ]),

    /* ---------------- BILLING ---------------- */
    Bill.aggregate([
      {
        $group: {
          _id: null,
          totalBills: { $sum: 1 },
          paidBills: {
            $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] }
          },
          pendingBills: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          overdueBills: {
            $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] }
          },
          totalRevenue: { $sum: '$finalAmount' }
        }
      }
    ]),

    /* ---------------- REVENUE TREND (MONTHLY) ---------------- */
    Bill.aggregate([
      {
        $match: {
          status: 'paid',
          paymentDate: { $gte: startOfYear }
        }
      },
      {
        $group: {
          _id: { $month: '$paymentDate' },
          revenue: { $sum: '$finalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]),

    /* ---------------- MEMBER GROWTH ---------------- */
    User.aggregate([
      {
        $match: { role: 'member' }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
  ])

  return {
    users: userStats[0] || {},
    supplements: supplementStats[0] || {},
    packages: packageStats[0] || {},
    notifications: notificationStats[0] || {},
    dietPlans: dietStats[0] || {},
    billing: billingStats[0] || {},
    charts: {
      revenueByMonth: revenueTrends,
      memberGrowth
    }
  }
}

import mongoose from 'mongoose'

export const getStaffMemberAnalytics = async (staffId: string) => {
  if (!mongoose.Types.ObjectId.isValid(staffId)) {
    throw new ApiError('Invalid staff id', HTTPSTATUS.BAD_REQUEST)
  }

  const staff = await User.findById({ _id: staffId })
  if (!staff || staff.role !== 'staff') {
    throw new ApiError('Staff not found', HTTPSTATUS.NOT_FOUND)
  }

  const startOfYear = new Date(new Date().getFullYear(), 0, 1)

  const [memberStats, billingStats, revenueTrends, memberGrowth] = await Promise.all([
    /* ---------------- MEMBERS ---------------- */
    User.aggregate([
      {
        $match: {
          role: 'member'
        }
      },
      {
        $group: {
          _id: null,
          totalMembers: { $sum: 1 },
          activeMembers: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          }
        }
      }
    ]),

    /* ---------------- BILLING ---------------- */
    Bill.aggregate([
      {
        $group: {
          _id: null,
          totalBills: { $sum: 1 },
          paidBills: {
            $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] }
          },
          pendingBills: {
            $sum: { $cond: [{ $in: ['$status', ['pending', 'overdue']] }, 1, 0] }
          },
          totalRevenue: { $sum: '$finalAmount' }
        }
      }
    ]),

    /* ---------------- REVENUE TREND ---------------- */
    Bill.aggregate([
      {
        $match: {
          status: 'paid',
          paymentDate: { $gte: startOfYear }
        }
      },
      {
        $group: {
          _id: { $month: '$paymentDate' },
          revenue: { $sum: '$finalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]),

    /* ---------------- MEMBER GROWTH ---------------- */
    User.aggregate([
      {
        $match: {
          role: 'member'
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
  ])

  return {
    members: memberStats[0] || { totalMembers: 0, activeMembers: 0 },
    billing: billingStats[0] || {
      totalBills: 0,
      paidBills: 0,
      pendingBills: 0,
      totalRevenue: 0
    },
    charts: {
      revenueByMonth: revenueTrends,
      memberGrowth
    }
  }
}
