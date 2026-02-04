import { Router } from 'express'
import {
  getMemberAnalyticsController,
  getBillsController,
  getBillController,
  getNotificationsController,
  getNotificationController,
  markNotificationAsReadController,
  deleteNotificationController
} from '@/controller/member.controller'
import { protectRoute } from '@/middleware/auth.middleware'

const router = Router()

// =======================
// ANALYTICS
// =======================
router.get('/analytics', protectRoute, getMemberAnalyticsController)

// =======================
// BILLS
// =======================
router.get('/bills', protectRoute, getBillsController)
router.get('/bills/:billId', getBillController)

// =======================
// NOTIFICATIONS
// =======================
router.get('/notifications', protectRoute, getNotificationsController)
router.get('/notifications/:notificationId', getNotificationController)
router.patch('/notifications/:notificationId/read', markNotificationAsReadController)
router.delete('/notifications/:notificationId', deleteNotificationController)

export default router
