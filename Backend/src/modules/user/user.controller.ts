import { Request, Response } from 'express'
import asyncHandler from '@/middleware/asyncHandler.middleware'
import { HTTPSTATUS } from '@/config/http.config'
import { generateMemberId, validateMemberStatus, validateObjectId } from '@/utils/helper.util'
import User from './user.model'
import { Package } from '@/modules/package/Package.model'
import bcrypt from 'bcryptjs'
import { Supplement } from '../supplement/supplement.model'
import { Notification } from '../notification/notification.model'
import { DietPlan } from '../diet/diet.model'
import { Bill } from '../bill/bill.model'
import { Types } from 'mongoose'

// ADD MEMBER
export const addMember = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone, gender, assignedPackage } = req.body

  if (!name || !email || !password || !phone || !gender) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      success: false,
      error: 'All required fields must be provided'
    })
  }

  validateObjectId(assignedPackage)
  const existsPackage = await Package.exists({ _id: assignedPackage })
  if (!existsPackage) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'package not found' })
  }

  const exists = await User.findOne({ email })
  if (exists) {
    return res.status(HTTPSTATUS.CONFLICT).json({ success: false, error: 'email already exists' })
  }

  const member = new User({
    name,
    email,
    password,
    phone,
    gender,
    role: 'member',
    memberId: generateMemberId(),
    assignedPackage
  })

  const savedMember = await member.save()

  res
    .status(HTTPSTATUS.CREATED)
    .json({ success: true, message: 'member created', data: savedMember })
})

// GET ALL MEMBERS - member, active
export const getMembers = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query as { status?: string }
  const filter: Record<string, any> = {}
  if (status) {
    if (!validateMemberStatus(status)) {
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ success: false, error: 'status should be valid' })
    } else {
      filter.status = status
    }
  }
  filter.role = 'member'
  const members = await User.find(filter).sort({ createdAt: -1 }).populate('assignedPackage').lean()

  res
    .status(HTTPSTATUS.OK)
    .json({ success: true, message: 'members fetched success', data: members })
})

// GET MEMBER
export const getMember = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }
  const { status } = req.query as { status?: string }
  if (!_id) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'id or status is required' })
  }

  const query: any = {}

  validateObjectId(_id)
  query._id = _id

  if (status) {
    if (validateMemberStatus(status)) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({ success: false, error: 'bad request' })
    } else {
      query.status = status
    }
  }

  const exists = await User.findOne(query).lean()
  if (!exists) {
    return res.status(HTTPSTATUS.CONFLICT).json({ success: false, error: 'member already exists' })
  }

  res.status(HTTPSTATUS.OK).json({ success: true, message: 'member data', data: exists })
})

// UPDATE MEMBER
export const updateMember = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }
  const { name, email, password, phone, address, dateOfBirth, gender, status, assignedPackage } =
    req.body

  if (!_id)
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ success: false, error: '_id is required' })
  validateObjectId(_id)

  const user = await User.findById(_id)
  if (!user)
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'member not found' })

  const allowedFields = [
    'name',
    'email',
    'password',
    'phone',
    'address',
    'dateOfBirth',
    'gender',
    'status',
    'assignedPackage'
  ] as const

  const updateData: Record<string, any> = {}
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      let req_data = req.body[field]
      let existing = user[field]

      // dateofbirth
      if (field === 'dateOfBirth') {
        if (typeof req_data !== 'string' || isNaN(Date.parse(req_data))) {
          return res
            .status(HTTPSTATUS.BAD_REQUEST)
            .json({ success: false, error: 'invalid dateOfBirth' })
        }
        req_data = new Date(req_data)
      }

      // assignedPackage
      if (field === 'assignedPackage') {
        validateObjectId(req_data)
        const exists = await Package.exists({ _id: req_data })
        if (!exists) {
          return res
            .status(HTTPSTATUS.NOT_FOUND)
            .json({ success: false, error: 'package not found' })
        }
      }

      // password
      if (field === 'password') {
        const isMatched = await user.comparePassword(req_data)
        if (!isMatched) {
          updateData.password = await bcrypt.hash(req_data, 10)
        }
        continue
      }

      const isSame =
        typeof req_data === 'object'
          ? JSON.stringify(req_data) === JSON.stringify(existing)
          : req_data === existing

      if (!isSame) {
        updateData[field] = req_data
      }
    }
  }

  if (!Object.keys(updateData).length) {
    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: 'no changes detected'
    })
  }

  const updatedMember = await User.findByIdAndUpdate({ _id }, { $set: updateData }, { new: true })
  if (!updatedMember)
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'member update failed' })

  res.status(HTTPSTATUS.CREATED).json({ success: true, message: 'member data updated' })
})

// DELETE MEMBER
export const deleteMember = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }
  if (!_id) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ success: false, error: 'id is required' })
  }

  validateObjectId(_id)

  const exists = await User.exists({ _id })
  if (!exists) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'member not found' })
  }

  const member = await User.findByIdAndDelete({ _id })
  if (!member)
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'member not found' })
  res.status(HTTPSTATUS.OK).json({ success: true, message: 'member deleted successfully' })
})

//  ADD STAFF
export const addStaff = asyncHandler(async (req: Request, res: Response) => {
  const { id: adminId } = req.user as { id?: string }
  if (!adminId) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'admin id is required' })
  }
  validateObjectId(adminId)

  const { name, email, password, phone } = req.body

  const existing = await User.findOne({ email })
  if (existing) {
    return res.status(HTTPSTATUS.CONFLICT).json({ success: false, error: 'email already exists' })
  }

  const staff = new User({
    name,
    email,
    password,
    phone,
    role: 'staff',
    status: 'active'
  })

  const savedStaff = await staff.save()

  res.status(HTTPSTATUS.CREATED).json({ success: false, message: 'staff created' })
})

// GET STAFFS
export const getStaffs = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query as { status?: string }

  const filter: Record<string, any> = {}
  const allowedStatus = ['active', 'inactive', 'suspended']
  if (status) {
    if (allowedStatus.includes(status)) {
      filter.status = status
    }
  }
  filter.role = 'staff'

  const staffs = await User.find(filter).sort({ createdAt: -1 }).lean()
  res.status(HTTPSTATUS.OK).json({ success: false, message: 'staffs fetched', data: staffs })
})

// GET STAFF
export const getStaff = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }
  if (!_id) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'staff id is required' })
  }
  validateObjectId(_id)

  const staff = await User.findById(_id)
  if (!staff) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'staff not foudn' })
  }
  res.status(HTTPSTATUS.OK).json({ success: true, message: 'staff details', data: staff })
})

// UPDATE STAFF
export const updateStaff = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }
  if (!_id) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'staff id is required' })
  }
  validateObjectId(_id)

  const user = await User.findById(_id)
  if (!user) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'staff not foudn' })
  }

  const allowedFields = ['name', 'email', 'password', 'phone', 'gender', 'status'] as const
  const updates: Record<string, any> = {}
  for (const field of allowedFields) {
    if (!(field in req.body)) continue

    const req_data = req.body[field]
    const exist = user[field]

    if (field === 'password') {
      const isMatched = await user.comparePassword(req_data)
      if (!isMatched) {
        updates.password = await bcrypt.hash(req_data, 10)
      }
    }

    if (req_data !== exist) {
      updates[field] = req_data
    }
  }

  if (updates.email) {
    const existing_email = await User.exists({ email: updates.email, _id: { $ne: user._id } })
    if (existing_email) {
      return res.status(HTTPSTATUS.CONFLICT).json({ success: false, error: 'email already exists' })
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(HTTPSTATUS.OK).json({ success: true, message: 'no changes detected' })
  }

  await User.findByIdAndUpdate(_id, updates, { new: true })

  res.status(HTTPSTATUS.OK).json({ success: true, message: 'staff updated' })
})

// DELETE STAFF
export const deleteStaff = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }
  if (!_id) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'staff id is required' })
  }
  validateObjectId(_id)

  const staff = await User.findByIdAndDelete(_id)
  if (!staff) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'staff not found' })
  }

  res.status(HTTPSTATUS.OK).json({ success: true, message: 'staff deleted' })
})

// ANALYTICS
const startOfYear = new Date(new Date().getFullYear(), 0, 1)

// ADMIN
export const getAdminAnalytics = asyncHandler(async (req: Request, res: Response) => {
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
          paymentDate: {
            $gte: startOfYear,
            $type: 'date'
          },
          finalAmount: { $type: 'number' }
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

  res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'admin analytics',
    data: {
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
  })
})

// STAFF
export const getStaffAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { id: staffId } = req.user as { id?: string }
  if (!staffId) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ success: false, error: 'staffid is required' })
  }

  validateObjectId(staffId)

  const staff = await User.findById({ _id: staffId })
  if (!staff || staff.role !== 'staff') {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'staff not found' })
  }

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

  res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'staff analytics',
    data: {
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
  })
})

// MEMBER
export const getMemberAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { id: _id } = req.user as { id?: string }
  if (!_id) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'member id is required' })
  }
  validateObjectId(_id)

  // Check if user exists
  const user = await User.findById({ _id: _id }).populate('assignedPackage')

  if (!user) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'user not found' })
  }

  // Get current date for calculations
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastMonth = new Date(currentYear, currentMonth - 1, 1)
  const lastMonthEnd = new Date(currentYear, currentMonth, 0)

  const totalBills = await Bill.countDocuments({ memberId: _id })

  const totalSpentResult = await Bill.aggregate([
    {
      $match: {
        member: user._id,
        status: 'paid'
      }
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: '$finalAmount' }
      }
    }
  ])
  const totalSpent = totalSpentResult[0]?.totalSpent || 0

  const totalNotifications = await Notification.countDocuments({
    $or: [{ targetAudience: 'all' }, { targetAudience: 'active_members' }, { recipients: _id }]
  })

  const unreadNotifications = await Notification.countDocuments({
    $or: [{ targetAudience: 'all' }, { targetAudience: 'active_members' }, { recipients: _id }],
    isRead: false
  })

  const pendingBills = await Bill.find({
    memberId: _id,
    status: { $in: ['pending', 'overdue'] }
  })

  const pendingDues = pendingBills.length
  const pendingDuesAmount = pendingBills.reduce((sum, bill) => sum + bill.finalAmount, 0)
  const twelveMonthsAgo = new Date(currentYear, currentMonth - 11, 1)

  const monthlySpendingData = await Bill.aggregate([
    {
      $match: {
        memberId: user._id,
        status: 'paid',
        paymentDate: { $gte: twelveMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$paymentDate' },
          month: { $month: '$paymentDate' }
        },
        totalSpent: { $sum: '$finalAmount' },
        billCount: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: {
          $let: {
            vars: {
              monthsInString: [
                '',
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
              ]
            },
            in: { $arrayElemAt: ['$$monthsInString', '$_id.month'] }
          }
        },
        totalSpent: 1,
        billCount: 1
      }
    }
  ])

  const recentBills = await Bill.find({ memberId: _id })
    .sort({ paymentDate: -1 })
    .limit(5)
    .select('billNumber finalAmount paymentDate status')
    .lean()

  const thisMonthSpentResult = await Bill.aggregate([
    {
      $match: {
        memberId: user._id,
        status: 'paid',
        paymentDate: { $gte: firstDayOfMonth }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$finalAmount' }
      }
    }
  ])
  const thisMonthSpent = thisMonthSpentResult[0]?.total || 0

  const lastMonthSpentResult = await Bill.aggregate([
    {
      $match: {
        memberId: user._id,
        status: 'paid',
        paymentDate: { $gte: lastMonth, $lte: lastMonthEnd }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$finalAmount' }
      }
    }
  ])
  const lastMonthSpent = lastMonthSpentResult[0]?.total || 0

  const averageMonthlySpent =
    monthlySpendingData.length > 0
      ? monthlySpendingData.reduce((sum, m) => sum + m.totalSpent, 0) / monthlySpendingData.length
      : 0

  const paymentMethodsData = await Bill.aggregate([
    {
      $match: {
        memberId: user._id,
        status: 'paid'
      }
    },
    {
      $group: {
        _id: '$paymentMethod',
        count: { $sum: 1 },
        total: { $sum: '$finalAmount' }
      }
    },
    {
      $project: {
        _id: 0,
        method: '$_id',
        count: 1,
        total: 1
      }
    },
    {
      $sort: { total: -1 }
    }
  ])
  const activePackage =
    user.assignedPackage && !(user.assignedPackage instanceof Types.ObjectId)
      ? user.assignedPackage.packageName
      : null

  const analyticsResponse: Record<string, any> = {
    summary: {
      totalBills,
      totalSpent,
      totalNotifications,
      unreadNotifications,
      pendingDues,
      pendingDuesAmount,
      activePackage,
      memberSince: user.createdAt
    },
    chartData: {
      monthlySpending: monthlySpendingData,
      recentBills: recentBills.map((bill) => ({
        billNumber: bill.billNumber,
        amount: bill.finalAmount,
        paymentDate: bill.paymentDate,
        status: bill.status
      }))
    },
    quickStats: {
      thisMonthSpent,
      lastMonthSpent,
      averageMonthlySpent: Math.round(averageMonthlySpent * 100) / 100,
      paymentMethods: paymentMethodsData
    }
  }

  res
    .status(HTTPSTATUS.OK)
    .json({ success: true, message: 'member analytics', data: analyticsResponse })
})

export const getMembersList = asyncHandler(async (req: Request, res: Response) => {
  const members = await User.find({ role: 'member', status: 'active' })
    .select('_id name memberId')
    .sort({ createdAt: -1 })
    .lean()
  res.status(HTTPSTATUS.OK).json({ success: true, message: 'member list', data: members })
})
