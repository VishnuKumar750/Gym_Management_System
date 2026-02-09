import { Router } from 'express'
import { protectRoute } from '@/middleware/auth.middleware'
import { rbac } from '@/middleware/rbac.middleware'
import * as BillController from './bill.controller'

const billRouter = Router()

billRouter.use(protectRoute)

billRouter.get('/admin', rbac('admin'), BillController.getBills)
billRouter.post('/admin', rbac('admin'), BillController.addBill)
billRouter.get('/:_id/bill', rbac('admin', 'member'), BillController.getBill)
billRouter.put('/:_id/bill', rbac('admin'), BillController.updateBill)
billRouter.get('/member', rbac('member'), BillController.getMemberBills)

export default billRouter
