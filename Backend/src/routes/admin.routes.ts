import { validate } from '@/middleware/validate.middleware'
import { Router } from 'express'
import { protectRoute } from '@/middleware/auth.middleware'
import { rbac } from '@/middleware/rbac.middleware'
import {
  createMemberController,
  updateMemberController,
  deleteMemberController,
  getAllMembersController,
  getMemberController,
  createStaffController,
  updateStaffController,
  deleteStaffController,
  getAllStaffsController,
  getStaffController,
  createAdminController,
  updateAdminController,
  deleteAdminController,
  getAllAdminsController,
  getAdminController,
  getAdminAnalyticsController,
  getStaffAnalyticsController
} from '@/controller/admin.controller'

const adminRoutes = Router()

// admin api
// adminRoutes.use(protectRoute, rbac(USER_ROLES[0]))

// ============================================
// MEMBER ROUTES
// ============================================
// POST   /api/users/members          - create member        (admin only)
// GET    /api/users/members          - get all members      (admin, staff)
// GET    /api/users/members/:id      - get single member    (admin, staff, member-self)
// PUT    /api/users/members/:id      - update member        (admin, staff)
// DELETE /api/users/members/:id      - delete member        (admin only)

adminRoutes.post('/members', createMemberController)
adminRoutes.get('/members', getAllMembersController)
adminRoutes.get('/members/:id', getMemberController)
adminRoutes.put('/members/:id', protectRoute, updateMemberController)
adminRoutes.delete('/members/:id', protectRoute, deleteMemberController)

// ============================================
// STAFF ROUTES
// ============================================
// POST   /api/users/staffs           - create staff         (admin only)
// GET    /api/users/staffs           - get all staffs       (admin only)
// GET    /api/users/staffs/:id       - get single staff     (admin, staff-self)
// PUT    /api/users/staffs/:id       - update staff         (admin only)
// DELETE /api/users/staffs/:id       - delete staff         (admin only)
adminRoutes.get('/staff/analytics', protectRoute, getStaffAnalyticsController)
adminRoutes.post('/staffs', protectRoute, createStaffController)
adminRoutes.get('/staffs', protectRoute, getAllStaffsController)
adminRoutes.get('/staffs/:id', protectRoute, getStaffController)
adminRoutes.put('/staffs/:id', protectRoute, updateStaffController)
adminRoutes.delete('/staffs/:id', protectRoute, deleteStaffController)

// ============================================
// ADMIN ROUTES
// ============================================
// POST   /api/users/admins           - create admin         (admin only)
// GET    /api/users/admins           - get all admins       (admin only)
// GET    /api/users/admins/:id       - get single admin     (admin only)
// PUT    /api/users/admins/:id       - update admin         (admin only)
// DELETE /api/users/admins/:id       - delete admin         (admin only)

adminRoutes.post('/admins', createAdminController)
adminRoutes.get('/admins', getAllAdminsController)
adminRoutes.get('/admins/:id', getAdminController)
adminRoutes.put('/admins/:id', updateAdminController)
adminRoutes.delete('/admins/:id', deleteAdminController)
adminRoutes.get('/admin/analytics', getAdminAnalyticsController)

export default adminRoutes
