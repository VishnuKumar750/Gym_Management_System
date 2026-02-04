import { Router } from 'express'
import {
  createDietPlanController,
  getAllDietPlansController,
  getMemberDietPlansController,
  getDietPlanController,
  updateDietPlanController,
  deleteDietPlanController
} from '@/controller/dietPlan.controller'

const router = Router()

// ADMIN / TRAINER
router.post('/', createDietPlanController)
router.put('/:dietPlanId', updateDietPlanController)

// ADMIN
router.get('/', getAllDietPlansController)
router.delete('/:dietPlanId', deleteDietPlanController)

// MEMBER + ADMIN
router.get('/member/:memberId', getMemberDietPlansController)
router.get('/:dietPlanId', getDietPlanController)

export default router
