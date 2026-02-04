import { Router } from 'express'
import {
  createBillController,
  getAllBillsController,
  getMemberBillsController,
  getBillController,
  updateBillController,
  deleteBillController
} from '../controller/bill.controller'
import { protectRoute } from '@/middleware/auth.middleware'

const router = Router()

// ============================================
// BILL ROUTES
// ============================================
//
// POST   /api/bills                        - create bill              (admin)
// GET    /api/bills                        - get all bills            (admin)
// GET    /api/bills/member/:memberId       - get bills by member      (admin, member-self*)
// GET    /api/bills/:id                    - get single bill          (admin, member-self*)
// PUT    /api/bills/:id                    - update bill              (admin)
// DELETE /api/bills/:id                    - delete bill              (admin)
//
// * member-self: route allows 'member' role in, but the service
//   layer compares req.user._id against the bill/member ownership
//   and throws FORBIDDEN if they don't match.
// ============================================

// Create bill — admin only
router.post('/', protectRoute, createBillController)
// Get all bills across every member — admin only
router.get('/', getAllBillsController)
// Get all bills for a specific member — admin sees any, member sees own only
router.get('/member/:memberId', getMemberBillsController)
// Get a single bill by ID — admin sees any, member sees own only
router.get('/:id', getBillController)
// Update bill — admin only
router.put('/:id', updateBillController)
// Delete bill — admin only
router.delete('/:id', deleteBillController)

export default router

// ============================================
// REGISTER IN app.ts / server.ts
// ============================================
//
// import billRoutes from './routes/bill.routes'
//
// app.use('/api/bills', billRoutes)
