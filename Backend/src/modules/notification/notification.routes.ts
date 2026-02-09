import { Router } from 'express'
import * as NotificationController from './notification.controller'
import { protectRoute } from '@/middleware/auth.middleware'
import { rbac } from '@/middleware/rbac.middleware'

const router = Router()

router.use(protectRoute)

router.post('/', rbac('admin'), NotificationController.addNotification)
router.get('/', rbac('admin'), NotificationController.getNotifications)
router.get('/member/:_id', rbac('admin', 'member'), NotificationController.getNotification)
router.get('/member-notification', rbac('member'), NotificationController.getMemberNotifications)

export default router
