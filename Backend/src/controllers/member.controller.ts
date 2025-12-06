import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.middleware';
import { MemberService } from '../services/member.service';
import { ApiResponse } from '../utils/apiResponse.utils';
import { HTTPSTATUS } from '../config/http.config';

export const createMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await MemberService.createMember(req.body);
  const response = new ApiResponse(HTTPSTATUS.CREATED, 'Member created', member);
  return res.status(response.statusCode).json(response);
});

export const getAllMembers = asyncHandler(async (req: Request, res: Response) => {
  const members = await MemberService.getAllMembers();
  const response = new ApiResponse(HTTPSTATUS.OK, 'MEMBERS', members);
  return res.status(response.statusCode).json(response);
});
