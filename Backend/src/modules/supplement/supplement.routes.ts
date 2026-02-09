import { Router } from 'express'
import * as SupplementController from './supplement.controller'
import { protectRoute } from '@/middleware/auth.middleware'
import { rbac } from '@/middleware/rbac.middleware'

const router = Router()

router.use(protectRoute, rbac('admin'))
// ADMIN
router.post('/', SupplementController.addSupplement)
router.put('/:_id', SupplementController.updateSupplement)
router.delete('/:_id', SupplementController.deleteSupplement)
router.get('/', rbac('admin'), SupplementController.getSupplements)
router.get('/:_id', rbac('admin'), SupplementController.getSupplement)

export default router
