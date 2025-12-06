import { IJWTPayload } from './jwt.utils';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { config } from '../config/app.config';
import ErrorHandler from './ErrorHandler.utils';
import { HTTPSTATUS } from '../config/http.config';

export interface IJWTPayload extends JwtPayload {
  id: string;
  role: string;
}

export const signToken = (payload: IJWTPayload, options: SignOptions = {}): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES,
    ...options,
  });
};

export const jwtVerify = (token: string): IJWTPayload => {
  if (!token) {
    throw new ErrorHandler(HTTPSTATUS.BAD_REQUEST, 'token is missing');
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as IJWTPayload;
    return decoded;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new ErrorHandler(HTTPSTATUS.UNAUTHORIZED, 'Token has expired');
    }

    if (error.name === 'JsonWebTokenError') {
      throw new ErrorHandler(HTTPSTATUS.UNAUTHORIZED, 'Invalid token');
    }

    throw new ErrorHandler(HTTPSTATUS.INTERNAL_SERVER_ERROR, 'Token verification failed');
  }
};
