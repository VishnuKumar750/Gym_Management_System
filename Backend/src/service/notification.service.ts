import { Types } from 'mongoose'
import { Notification } from '../model/notification.model'
import ApiError from '@/utils/ApiError'
import { HTTPSTATUS } from '@/config/http.config'

// helpers
const validateObjectId = (id: string, name = 'ID') => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(`Invalid ${name}`, HTTPSTATUS.BAD_REQUEST)
  }
}

// 1. CREATE NOTIFICATION (ADMIN)
export const createNotification = async (data: any) => {
  const notification = await Notification.create({
    ...data,
    isSent: true,
    sentDate: new Date()
  })

  return {
    success: true,
    message: 'Notification created successfully',
    data: notification
  }
}

// 2. GET ALL NOTIFICATIONS (ADMIN)
export const getAllNotifications = async () => {
  const notifications = await Notification.find()
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .lean()

  return {
    success: true,
    message: notifications.length
      ? 'Notifications retrieved successfully'
      : 'No notifications found',
    data: notifications
  }
}

// 3. GET SINGLE NOTIFICATION (ADMIN + MEMBER)
export const getNotificationById = async (userId: string, notificationId: string) => {
  validateObjectId(notificationId, 'Notification ID')

  const notification = await Notification.findOne({
    _id: notificationId,
    $or: [{ targetAudience: 'all' }, { recipients: userId }]
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
}

// 4. UPDATE NOTIFICATION (ADMIN)
export const updateNotification = async (notificationId: string, data: any) => {
  validateObjectId(notificationId, 'Notification ID')

  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { $set: data },
    { new: true }
  ).lean()

  if (!notification) {
    throw new ApiError('Notification not found', HTTPSTATUS.NOT_FOUND)
  }

  return {
    success: true,
    message: 'Notification updated successfully',
    data: notification
  }
}

// 5. DELETE NOTIFICATION (ADMIN)
export const deleteNotification = async (notificationId: string) => {
  validateObjectId(notificationId, 'Notification ID')

  const notification = await Notification.findByIdAndDelete(notificationId).lean()

  if (!notification) {
    throw new ApiError('Notification not found', HTTPSTATUS.NOT_FOUND)
  }

  return {
    success: true,
    message: 'Notification deleted successfully',
    data: { deletedId: notificationId }
  }
}
