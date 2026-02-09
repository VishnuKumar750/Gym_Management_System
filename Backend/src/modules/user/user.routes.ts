import { protectRoute } from '@/middleware/auth.middleware'
import { rbac } from '@/middleware/rbac.middleware'
import { Router } from 'express'
import * as UserController from './user.controller'

const userRouter = Router()

userRouter.use(protectRoute)

// analytics
userRouter.get('/admin/analytics', rbac('admin'), UserController.getAdminAnalytics)
userRouter.get('/member/analytics', rbac('member'), UserController.getMemberAnalytics)
userRouter.get('/staff/analytics', rbac('staff'), UserController.getStaffAnalytics)

userRouter.post('/staff', rbac('admin'), UserController.addStaff)
userRouter.get('/staff', rbac('admin'), UserController.getStaffs)
userRouter.get('/staff/:_id', rbac('admin', 'staff'), UserController.getStaff)
userRouter.put('/staff/:_id', rbac('admin'), UserController.updateStaff)

// routes - member
userRouter.get('/members/:_id', rbac('admin', 'member'), UserController.getMember)
userRouter.put('/members/:_id', rbac('admin'), UserController.updateMember)
// route - admin
userRouter.post('/members', rbac('admin'), UserController.addMember)
userRouter.get('/members', rbac('admin', 'staff'), UserController.getMembers)
userRouter.delete('/members/:_id', rbac('admin'), UserController.deleteMember)
userRouter.get('/members-list', rbac('admin', 'staff'), UserController.getMembersList)
//  routes - admin, member

export default userRouter
