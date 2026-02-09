import { Router } from 'express'
import { validate } from '@/middleware/validate.middleware'
import { refreshLogin, logout, signincontroller } from '@/modules/auth/auth.controller'
import { signinSchema } from '@/modules/auth/auth.validate'
import { protectRoute } from '@/middleware/auth.middleware'

const authRoutes = Router()

authRoutes.post('/signin', signincontroller)
authRoutes.get('/me', protectRoute, refreshLogin)
authRoutes.post('/logout', protectRoute, logout)

export default authRoutes
