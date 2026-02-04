import { Request, Response } from 'express'
import asyncHandler from '@/middleware/asyncHandler.middleware'
import {
  getAnalytics,
  getBills,
  getBill,
  getNotifications,
  getNotification,
  markNotificationAsRead,
  deleteNotification
} from '../service/member.services'

// ANALYTICS
export const getMemberAnalyticsController = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAnalytics(req.user.id)
  res.status(200).json(result)
})

// =======================
// BILLS
// =======================
export const getBillsController = asyncHandler(async (req: Request, res: Response) => {
  const result = await getBills(req.user?.id)
  res.status(200).json(result)
})

export const getBillController = asyncHandler(async (req: Request, res: Response) => {
  const result = await getBill(req.user.id, req.params.billId)
  res.status(200).json(result)
})

// =======================
// NOTIFICATIONS
// =======================
export const getNotificationsController = asyncHandler(async (req: Request, res: Response) => {
  const result = await getNotifications(req.user.id)
  res.status(200).json(result)
})

export const getNotificationController = asyncHandler(async (req: Request, res: Response) => {
  const result = await getNotification(req.user.id, req.params.notificationId)
  res.status(200).json(result)
})

export const markNotificationAsReadController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await markNotificationAsRead(req.user.id, req.params.notificationId)
    res.status(200).json(result)
  }
)

export const deleteNotificationController = asyncHandler(async (req: Request, res: Response) => {
  const result = await deleteNotification(req.user.id, req.params.notificationId)
  res.status(200).json(result)
})
