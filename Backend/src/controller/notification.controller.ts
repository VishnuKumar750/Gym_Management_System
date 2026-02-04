import { Request, Response } from 'express'
import asyncHandler from '@/middleware/asyncHandler.middleware'
import * as NotificationService from '@/service/notification.service'

// CREATE
export const createNotificationController = asyncHandler(async (req: Request, res: Response) => {
  const result = await NotificationService.createNotification({
    ...req.body,
    createdBy: req.user?.id
  })
  res.status(201).json(result)
})

// GET ALL (ADMIN)
export const getAllNotificationsController = asyncHandler(async (_req: Request, res: Response) => {
  const result = await NotificationService.getAllNotifications()
  res.status(200).json(result)
})

// GET SINGLE (ADMIN + MEMBER)
export const getNotificationController = asyncHandler(async (req: Request, res: Response) => {
  const result = await NotificationService.getNotificationById(
    req.user?.id,
    req.params.notificationId
  )
  res.status(200).json(result)
})

// UPDATE
export const updateNotificationController = asyncHandler(async (req: Request, res: Response) => {
  const result = await NotificationService.updateNotification(req.params.notificationId, req.body)
  res.status(200).json(result)
})

// DELETE
export const deleteNotificationController = asyncHandler(async (req: Request, res: Response) => {
  const result = await NotificationService.deleteNotification(req.params.notificationId)
  res.status(200).json(result)
})
