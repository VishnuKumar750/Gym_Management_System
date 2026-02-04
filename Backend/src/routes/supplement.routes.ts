import { Router } from 'express'
import {
  createSupplementController,
  getSupplementsController,
  getSupplementController,
  updateSupplementController,
  deleteSupplementController
} from '@/controller/supplement.controller'
import { protectRoute } from '@/middleware/auth.middleware'

const router = Router()

// ADMIN
router.post('/', protectRoute, createSupplementController)
router.put('/:supplementId', protectRoute, updateSupplementController)
router.delete('/:supplementId', protectRoute, deleteSupplementController)

// ADMIN + MEMBER
router.get('/', protectRoute, getSupplementsController)
router.get('/:supplementId', protectRoute, getSupplementController)

export default router
