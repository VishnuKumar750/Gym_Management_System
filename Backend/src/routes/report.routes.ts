// routes/report.routes.ts
import { Router } from 'express';
import { getRevenueReport } from '../controllers/report.controller';
import { protectRoute } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/roleBasedAuth.middleware';
import { UserRole } from '../enums/roles.enums';

const router = Router();

// report route
// GET /api/reports/revenue?startDate=2025-01-01&endDate=2025-01-31&format=csv
router.get('/revenue', protectRoute, authorizeRoles(UserRole.ADMIN), getRevenueReport);

export default router;
