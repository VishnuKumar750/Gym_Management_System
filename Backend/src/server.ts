import express, { Application, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
dotenv.config()

import helmet from 'helmet'
import cors from 'cors'
import globalErrorHandler from './middleware/errorHandler.middleware'
import { morganLogger } from './middleware/morganLogger.middleware'
import cookieParser from 'cookie-parser'
import authRoutes from '@/modules/auth/auth.routes'
import packageRouter from '@/modules/package/package.routes'
import billRoutes from '@/modules/bill/bill.routes'
import notificationRoutes from '@/modules/notification/notification.routes'
import supplementRoutes from '@/modules/supplement/supplement.routes'
import dietPlanRoutes from '@/modules/diet/dietPlan.routes'
import userRouter from './modules/user/user.routes'

const app: Application = express()

import { config } from './config/app.config'
import dbconfig from './config/db.config'
import { HTTPSTATUS } from './config/http.config'
import { seedAdmin } from './seed/seed-admin'

app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:4173'],
    credentials: true
  })
)
app.use(morganLogger)

// routes
app.use('/api/v1/bills', billRoutes)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/packages', packageRouter)
app.use('/api/v1/notification', notificationRoutes)
app.use('/api/v1/supplement', supplementRoutes)
app.use('/api/v1/dietPlan', dietPlanRoutes)

app.use('/', (req: Request, res: Response) =>
  res.status(HTTPSTATUS.BAD_REQUEST).json({ success: false, error: 'you seems to be lost' })
)

app.use(globalErrorHandler)

const startServer = async () => {
  await dbconfig()
  await seedAdmin()

  app.listen(config.PORT, () => {
    console.log(`Server is running at ${config.PORT}`)
  })
}

startServer()
