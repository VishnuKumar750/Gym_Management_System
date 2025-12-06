import { Router } from 'express';
import {
  createSupplement,
  getAllSupplements,
  getSupplement,
  updateSupplement,
  deleteSupplement,
} from '../controllers/supplement.controller';
import { protectRoute } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/roleBasedAuth.middleware';
import { UserRole } from '../enums/roles.enums';
import { validate } from '../middleware/validate.middleware';
import {
  createSupplementSchema,
  updateSupplementSchema,
} from '../validations/supplement.validations';

const router = Router();

// supplement route
router.post(
  '/',
  protectRoute,
  authorizeRoles(UserRole.ADMIN),
  validate(createSupplementSchema),
  createSupplement
);
router.get('/', protectRoute, getAllSupplements);
router.get('/:id', protectRoute, getSupplement);
router.put(
  '/:id',
  protectRoute,
  authorizeRoles(UserRole.ADMIN),
  validate(updateSupplementSchema),
  updateSupplement
);
router.delete('/:id', protectRoute, authorizeRoles(UserRole.ADMIN), deleteSupplement);

export default router;
