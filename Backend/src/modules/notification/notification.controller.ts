import { Request, Response } from 'express'
import asyncHandler from '@/middleware/asyncHandler.middleware'
import { HTTPSTATUS } from '@/config/http.config'
import { validateObjectId } from '@/utils/helper.util'
import User from '../user/user.model'
import { Notification } from './notification.model'

// ADD NOTIFICATION
export const addNotification = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user as { id?: string }
  if (!id) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'admin id is required' })
  }

  const { title, message, type, recipient } = req.body
  validateObjectId(recipient)
  const exists = await User.exists({ _id: recipient })
  if (!exists) {
    return res.status(HTTPSTATUS.OK).json({ success: false, error: 'member not found' })
  }

  const notification = new Notification({
    title,
    message,
    type,
    recipient,
    createdBy: id,
    isSent: true,
    sentDate: Date.now()
  })

  const savedNotification = await notification.save()
  res.status(HTTPSTATUS.CREATED).json({ success: true, message: 'notification created' })
})

// GET NOTIFICATIONS - ADMIN
export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const { type: notificationType } = req.query as { type?: string }

  const query: Record<string, any> = {}
  const allowedTypes = ['payment_due', 'payment_received', 'general', 'holiday', 'event', 'urgent']
  if (notificationType) {
    if (!allowedTypes.includes(notificationType)) {
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ success: true, error: 'notification type not found' })
    }
    query.type = notificationType
  }

  const notifications = await Notification.find(query)
    .populate('recipient', 'name')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .lean()
  res
    .status(HTTPSTATUS.OK)
    .json({ success: true, message: 'notifications fetched', data: notifications })
})

// GET MEMBER NOTIFICATIONS - MEMBER
export const getMemberNotifications = asyncHandler(async (req: Request, res: Response) => {
  const { type: notificationType } = req.query as { type?: string }

  const { id } = req.user as { id?: string }
  if (!id) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'member id is not found' })
  }
  validateObjectId(id)

  const query: Record<string, any> = {}
  const allowedTypes = ['payment_due', 'payment_received', 'general', 'holiday', 'event', 'urgent']
  if (notificationType) {
    if (!allowedTypes.includes(notificationType)) {
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ success: true, error: 'notification type not found' })
    }
    query.type = notificationType
  }

  query.recipient = id

  const notifications = await Notification.find(query)
    .populate('createdBy', '_id name')
    .sort({ createdAt: -1 })
    .lean()
  res
    .status(HTTPSTATUS.OK)
    .json({ success: true, message: 'member notifications', data: notifications })
})

// GET NOTIFICATION
export const getNotification = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.query as { _id?: string }
  if (!_id)
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'notification id is required' })
  validateObjectId(_id)

  const { id } = req.user as { id?: string }
  if (!id)
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'member id is required' })
  validateObjectId(id)

  const notification = await Notification.find({ _id, recipients: id }).lean()
  if (!notification)
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ success: false, error: 'notification not found' })

  res
    .status(HTTPSTATUS.OK)
    .json({ success: true, message: 'notification fetched', data: notification })
})
