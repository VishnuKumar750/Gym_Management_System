import asyncHandler from './asyncHandler.middleware';
import { jwtVerify } from '../utils/jwt.utils';
import ErrorHandler from '../utils/ErrorHandler.utils';
import { HTTPSTATUS } from '../config/http.config';

export const protectRoute = asyncHandler(async (req: any, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ErrorHandler(HTTPSTATUS.UNAUTHORIZED, 'Token missing or malformed');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwtVerify(token);

  req.user = decoded;
  next();
});
