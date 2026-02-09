import { Router } from 'express'
import * as DietController from './dietPlan.controller'
import { rbac } from '@/middleware/rbac.middleware'
import { protectRoute } from '@/middleware/auth.middleware'

const router = Router()

router.use(protectRoute)

router.get('/member/:_id', rbac('member'), DietController.getMemberDiets)
router.post('/', rbac('admin'), DietController.addDiet)
router.put('/:_id', rbac('admin'), DietController.updateDiet)
router.delete('/:_id', rbac('admin'), DietController.deleteDiet)
router.get('/:_id/diet', rbac('admin', 'member'), DietController.getDiet)
router.get('/', rbac('admin'), DietController.getDiets)

export default router
