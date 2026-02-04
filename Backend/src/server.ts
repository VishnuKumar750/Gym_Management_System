import express, { Application, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import globalErrorHandler from './middleware/errorHandler.middleware'
import { morganLogger } from './middleware/morganLogger.middleware'
import cookieParser from 'cookie-parser'

const app: Application = express()

dotenv.config()
import { config } from './config/app.config'
import dbconfig from './config/db.config'

app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)
app.use(morganLogger)
// routes
import authRoutes from '@/routes/auth.routes'
import adminRoutes from '@/routes/admin.routes'
import memberRoutes from '@/routes/member.routes'
import packageRouter from '@/routes/package.routes'
import billRoutes from '@/routes/bill.routes'
import notificationRoutes from '@/routes/notification.routes'
import supplementRoutes from '@/routes/supplement.routes'
import dietPlanRoutes from '@/routes/dietPlan.routes'

app.use('/api/v1/bills', billRoutes)
app.use('/api/v1/user', adminRoutes)
app.use('/api/v1/member', memberRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/packages', packageRouter)
app.use('/api/v1/notification', notificationRoutes)
app.use('/api/v1/supplement', supplementRoutes)
app.use('/api/v1/dietPlan', dietPlanRoutes)

app.use('/', (req: Request, res: Response, next: NextFunction) =>
  res.status(200).json({ message: 'Backend is working' })
)

app.use(globalErrorHandler)

app.listen(config.PORT, () => {
  console.log(`Server is running at ${config.PORT}`)
  dbconfig()
})
