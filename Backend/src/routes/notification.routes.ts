import { Router } from 'express'
import {
  createNotificationController,
  getAllNotificationsController,
  getNotificationController,
  updateNotificationController,
  deleteNotificationController
} from '@/controller/notification.controller'
import { protectRoute } from '@/middleware/auth.middleware'

const router = Router()

// ADMIN
router.post('/', protectRoute, createNotificationController)
router.get('/', protectRoute, getAllNotificationsController)
router.put('/:notificationId', updateNotificationController)
router.delete('/:notificationId', deleteNotificationController)

// ADMIN + MEMBER
router.get('/:notificationId', protectRoute, getNotificationController)

export default router
