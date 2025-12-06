import Router from 'express';
import { validate } from '../middleware/validate.middleware';
import { createMemberSchema } from '../validations/member.validations';
import { createMember, getAllMembers } from '../controllers/member.controller';
import { protectRoute } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/roleBasedAuth.middleware';
import { UserRole } from '../enums/roles.enums';

const router = Router();

// member route
router.post(
  '/',
  protectRoute,
  authorizeRoles(UserRole.ADMIN),
  validate(createMemberSchema),
  createMember
);

router.get('/all-members', protectRoute, authorizeRoles(UserRole.ADMIN), getAllMembers);

export default router;
