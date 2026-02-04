import { HTTPSTATUS } from '@/config/http.config'
import ApiError from '@/utils/ApiError'
import { Bill } from '@/model/bill.model'
import User from '@/model/user.model'
import { Notification } from '@/model/notification.model'
import { Types } from 'mongoose'

// Types
interface MonthlySpending {
  month: string
  year: number
  totalSpent: number
  billCount: number
}

interface AnalyticsResponse {
  summary: {
    totalBills: number
    totalSpent: number
    totalNotifications: number
    unreadNotifications: number
    pendingDues: number
    pendingDuesAmount: number
    activePackage: string | null
    memberSince: Date
  }
  chartData: {
    monthlySpending: MonthlySpending[]
    recentBills: Array<{
      billNumber: string
      amount: number
      paymentDate: Date
      status: string
    }>
  }
  quickStats: {
    thisMonthSpent: number
    lastMonthSpent: number
    averageMonthlySpent: number
    paymentMethods: Array<{
      method: string
      count: number
      total: number
    }>
  }
}

interface PaginationOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface BillsResponse {
  success: boolean
  message: string
  data: {
    bills: any[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

interface NotificationsResponse {
  success: boolean
  message: string
  data?: {
    notifications: any[]
    pagination: {
      total: number
      unread: number
    }
  }
}

type ID = {
  id: Types.ObjectId | string
}
// VALIDATE OBJECT ID
const validateObjectId = (id: string, fieldName: string = 'ID'): void => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(`Invalid ${fieldName}`, HTTPSTATUS.BAD_REQUEST)
  }
}
// CHECK USER EXISTS OR NOT
const checkUserExists = async (_id: string): Promise<void> => {
  validateObjectId(_id, 'User ID')
  const userExists = await User.exists({ _id })
  if (!userExists) {
    throw new ApiError('User not found', HTTPSTATUS.NOT_FOUND)
  }
}

// MEMBER ANALYTICS
export const getAnalytics = async (_id: ID): Promise<AnalyticsResponse> => {
  try {
    // Check if user exists
    const user = await User.findById({ _id: _id }).populate('assignedPackage')
    if (!user) {
      throw new ApiError('User not found', HTTPSTATUS.NOT_FOUND)
    }

    // Get current date for calculations
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastMonth = new Date(currentYear, currentMonth - 1, 1)
    const lastMonthEnd = new Date(currentYear, currentMonth, 0)

    // 1. Total Bills Count
    const totalBills = await Bill.countDocuments({ member: _id })

    // 2. Total Spent (Paid Bills Only)
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

    // ============================================
    // 3. Notifications
    // ============================================
    const totalNotifications = await Notification.countDocuments({
      $or: [{ targetAudience: 'all' }, { targetAudience: 'active_members' }, { recipients: _id }]
    })

    const unreadNotifications = await Notification.countDocuments({
      $or: [{ targetAudience: 'all' }, { targetAudience: 'active_members' }, { recipients: _id }],
      isRead: false
    })

    // ============================================
    // 4. Pending Dues
    // ============================================
    const pendingBills = await Bill.find({
      member: _id,
      status: { $in: ['pending', 'overdue'] }
    })

    const pendingDues = pendingBills.length
    const pendingDuesAmount = pendingBills.reduce((sum, bill) => sum + bill.finalAmount, 0)

    // ============================================
    // 5. Monthly Spending Chart Data (Last 12 Months)
    // ============================================
    const twelveMonthsAgo = new Date(currentYear, currentMonth - 11, 1)

    const monthlySpendingData = await Bill.aggregate([
      {
        $match: {
          member: user._id,
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

    // ============================================
    // 6. Recent Bills (Last 5)
    // ============================================
    const recentBills = await Bill.find({ member: _id })
      .sort({ paymentDate: -1 })
      .limit(5)
      .select('billNumber finalAmount paymentDate status')
      .lean()

    // ============================================
    // 7. This Month Spending
    // ============================================
    const thisMonthSpentResult = await Bill.aggregate([
      {
        $match: {
          member: user._id,
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

    // ============================================
    // 8. Last Month Spending
    // ============================================
    const lastMonthSpentResult = await Bill.aggregate([
      {
        $match: {
          member: user._id,
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

    // ============================================
    // 9. Average Monthly Spending
    // ============================================
    const averageMonthlySpent =
      monthlySpendingData.length > 0
        ? monthlySpendingData.reduce((sum, m) => sum + m.totalSpent, 0) / monthlySpendingData.length
        : 0

    // ============================================
    // 10. Payment Methods Breakdown
    // ============================================
    const paymentMethodsData = await Bill.aggregate([
      {
        $match: {
          member: user._id,
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

    // ============================================
    // 11. Build Response
    // ============================================
    const analyticsResponse: AnalyticsResponse = {
      summary: {
        totalBills,
        totalSpent,
        totalNotifications,
        unreadNotifications,
        pendingDues,
        pendingDuesAmount,
        activePackage: user.assignedPackage?.packageName || null,
        memberSince: user.joiningDate
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

    return analyticsResponse
  } catch (err) {
    throw err
  }
}
// GET BILLS
export const getBills = async (_id: string): Promise<BillsResponse> => {
  try {
    // Validate and check user
    await checkUserExists(_id)

    // Execute queries in parallel
    const bills = await Bill.find({ member: _id })
      .sort({ paymentDate: -1 })
      .populate({
        path: 'package',
        select: 'packageName'
      })
      .select('-__v')
      .lean()

    return {
      success: true,
      message: bills.length > 0 ? 'Bills retrieved successfully' : 'No bills found',
      data: bills
    }
  } catch (err) {
    throw err
  }
}
// GET SINGLE BILL
export const getBill = async (_id: string, billId: string) => {
  try {
    // Validate IDs
    await checkUserExists(_id)
    validateObjectId(billId, 'Bill ID')

    // Fetch bill with full details
    const bill = await Bill.findOne({ _id: billId, member: _id })
      .populate('member', 'name email memberId phone')
      .populate('package', 'packageName price duration features')
      .populate('createdBy', 'name email')
      .lean()

    if (!bill) {
      throw new ApiError('Bill not found', HTTPSTATUS.NOT_FOUND)
    }

    return {
      success: true,
      message: 'Bill retrieved successfully',
      data: bill
    }
  } catch (err) {
    throw err
  }
}
// GET NOTIFICATIONS
export const getNotifications = async (_id: string): Promise<NotificationsResponse> => {
  try {
    // Validate and check user
    await checkUserExists(_id)

    // Build query - notifications targeted to this member
    const baseQuery = {
      recipients: _id
    }

    // Execute queries in parallel
    const notifications = await Notification.find(baseQuery)
      .sort({ sentDate: -1 })
      .populate('title message type sentDate createdBy isSent scheduledDate')
      .populate('createdBy', 'name')
      .select('-__v')
      .lean()

    return {
      success: true,
      message:
        notifications.length > 0
          ? 'Notifications retrieved successfully'
          : 'No notifications found',
      data: notifications
    }
  } catch (err) {
    throw err
  }
}
// GET SINGLE NOTIFICATION
export const getNotification = async (_id: string, notificationId: string) => {
  try {
    // Validate IDs
    await checkUserExists(_id)
    validateObjectId(notificationId, 'Notification ID')

    // Build query to check if notification is accessible to user
    const notification = await Notification.findOne({
      _id: notificationId,
      $or: [{ targetAudience: 'all' }, { targetAudience: 'active_members' }, { recipients: _id }]
    })
      .populate('createdBy', 'name email')
      .lean()

    if (!notification) {
      throw new ApiError('Notification not found', HTTPSTATUS.NOT_FOUND)
    }

    return {
      success: true,
      message: 'Notification retrieved successfully',
      data: notification
    }
  } catch (err) {
    throw err
  }
}
// MARK NOTIFICATION AS READ
export const markNotificationAsRead = async (_id: string, notificationId: string) => {
  try {
    // Validate IDs
    await checkUserExists(_id)
    validateObjectId(notificationId, 'Notification ID')

    // Update notification
    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        $or: [{ targetAudience: 'all' }, { targetAudience: 'active_members' }, { recipients: _id }]
      },
      { $set: { isRead: true } },
      { new: true }
    ).lean()

    if (!notification) {
      throw new ApiError('Notification not found', HTTPSTATUS.NOT_FOUND)
    }

    return {
      success: true,
      message: 'Notification marked as read',
      data: notification
    }
  } catch (err) {
    throw err
  }
}
// DELETE NOTIFICATION
export const deleteNotification = async (_id: string, notificationId: string) => {
  try {
    // Validate IDs
    await checkUserExists(_id)
    validateObjectId(notificationId, 'Notification ID')

    // Delete notification (soft delete recommended in production)
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipients: _id // Only allow deleting if directly targeted
    }).lean()

    if (!notification) {
      throw new ApiError('Notification not found or cannot be deleted', HTTPSTATUS.NOT_FOUND)
    }

    return {
      success: true,
      message: 'Notification deleted successfully',
      data: { deletedId: notificationId }
    }
  } catch (err) {
    throw err
  }
}
