import { Router } from 'express'
import { validate } from '@/middleware/validate.middleware'
import { getMe, logout, signincontroller } from '@/controller/auth.controller'
import { signinSchema } from '@/validators/auth.validate'
import { protectRoute } from '@/middleware/auth.middleware'

const authRoutes = Router()

authRoutes.post('/signin', signincontroller)
authRoutes.get('/me', protectRoute, getMe)
authRoutes.post('/logout', protectRoute, logout)

export default authRoutes
