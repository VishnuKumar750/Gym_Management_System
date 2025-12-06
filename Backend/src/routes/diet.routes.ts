// routes/diet.routes.ts
import { Router } from 'express';
import { createDietPlan, getDietByMember, updateDietPlan } from '../controllers/diet.controller';
import { protectRoute } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/roleBasedAuth.middleware';
import { UserRole } from '../enums/roles.enums';

const router = Router();

// diet route
router.post('/create', protectRoute, authorizeRoles(UserRole.ADMIN), createDietPlan);
router.get('/member/:memberId', protectRoute, authorizeRoles(UserRole.MEMBER), getDietByMember);
router.put('/:id', protectRoute, authorizeRoles(UserRole.ADMIN), updateDietPlan);

export default router;
