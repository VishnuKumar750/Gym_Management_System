import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler.utils';
import { HTTPSTATUS } from '../config/http.config';
import { UserRole } from '../enums/roles.enums';

// roles: This will accept allowed roles for each route
export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      throw new ErrorHandler(HTTPSTATUS.UNAUTHORIZED, 'User role missing in token');
    }

    if (!roles.includes(userRole)) {
      throw new ErrorHandler(HTTPSTATUS.FORBIDDEN, 'Access denied: Insufficient permissions');
    }

    next();
  };
};
