import asyncHandler from '../middleware/asyncHandler.middleware';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler.utils';
import { HTTPSTATUS } from '../config/http.config';
import { createUser, getUserByEmail } from '../services/user.service';
import { ApiResponse } from '../utils/apiResponse.utils';
import { signToken } from '../utils/jwt.utils';

// register user
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, role } = req.body;

  const savedUser = await createUser({ email: email, password: password, role: role });

  if (!savedUser) {
    throw new ErrorHandler(HTTPSTATUS.INTERNAL_SERVER_ERROR, 'something went wrong');
  }

  const newUser = {
    email: savedUser.email,
  };

  const response = new ApiResponse(HTTPSTATUS.CREATED, 'user registered successfully', newUser);

  return res.status(response.statusCode).json(response);
});

// login user
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ErrorHandler(HTTPSTATUS.BAD_REQUEST, 'please provide email');
  }

  if (!password) {
    throw new ErrorHandler(HTTPSTATUS.BAD_REQUEST, 'please provide password');
  }

  const user = await getUserByEmail(email);
  if (!user) {
    throw new ErrorHandler(HTTPSTATUS.NOT_FOUND, 'user not found');
  }
  const matchedPassword = await user.comparePassword(password);
  if (!matchedPassword) throw new ErrorHandler(HTTPSTATUS.UNAUTHORIZED, 'incorrect password');

  const safeUser = user.toObject();
  delete (safeUser as any).password;

  // generate jwt
  const token = signToken({ id: user._id.toString(), role: user.role });

  if (!token) {
    throw new ErrorHandler(HTTPSTATUS.INTERNAL_SERVER_ERROR, 'token generation failed');
  }

  const response = new ApiResponse(HTTPSTATUS.OK, 'user logged in successfully', {
    user: safeUser,
    token,
  });

  return res.status(response.statusCode).json(response);
});
