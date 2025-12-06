import { Router } from 'express';
import { createBill, getMemberBills, updateBillStatus } from '../controllers/bill.controller';
import { validate } from '../middleware/validate.middleware';
import { createBillSchema, updateBillStatusSchema } from '../validations/bill.validations';
import { protectRoute } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/roleBasedAuth.middleware';
import { UserRole } from '../enums/roles.enums';

const router = Router();

// bill route
router.post(
  '/',
  protectRoute,
  authorizeRoles(UserRole.ADMIN),
  validate(createBillSchema),
  createBill
);
router.get('/:memberId', protectRoute, authorizeRoles(UserRole.MEMBER), getMemberBills);
router.patch('/:id', validate(updateBillStatusSchema), updateBillStatus);

export default router;
