import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

const app: Application = express();

dotenv.config();
import { config } from './config/app.config';
import dbconfig from './config/db.config';
import errorHandler from './middleware/errorHandler.middleware';

app.use(helmet());
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
import userRoutes from './routes/user.routes';
import memberRoutes from './routes/member.routes';
import notificationRoutes from './routes/notification.routes';
import billRoutes from './routes/bill.routes';
import reportRoute from './routes/report.routes';
import supplementRoute from './routes/supplement.routes';
import dietRoute from './routes/diet.routes';

app.use('/api/user', userRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/reports', reportRoute);
app.use('/api/supplement', supplementRoute);
app.use('/api/deit', dietRoute);

app.use('/', (req: Request, res: Response, next: NextFunction) =>
  res.status(200).json({ message: 'Backend is working' })
);

app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server is running at ${config.PORT}`);
  dbconfig();
});
