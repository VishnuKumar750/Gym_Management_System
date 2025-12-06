import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { createNotificationSchema } from '../validations/notification.validation';
import {
  createNotification,
  getMemberNotifications,
  markNotificationAsRead,
} from '../controllers/notification.controller';
import { protectRoute } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/roleBasedAuth.middleware';
import { UserRole } from '../enums/roles.enums';

const router = Router();

// notification route
// Admin - create custom notification for any member
router.post(
  '/create',
  protectRoute,
  authorizeRoles(UserRole.ADMIN),
  validate(createNotificationSchema),
  createNotification
);
router.get('/:memberId', protectRoute, authorizeRoles(UserRole.MEMBER), getMemberNotifications);
router.get('/read/:id', protectRoute, authorizeRoles(UserRole.MEMBER), markNotificationAsRead);

export default router;
