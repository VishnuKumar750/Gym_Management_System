// controllers/diet.controller.ts
import asyncHandler from '../middleware/asyncHandler.middleware';
import { DietService } from '../services/diet.service';
import { ApiResponse } from '../utils/apiResponse.utils';
import { HTTPSTATUS } from '../config/http.config';

export const createDietPlan = asyncHandler(async (req, res) => {
  const result = await DietService.createDietPlan(req.body);
  res.status(HTTPSTATUS.CREATED).json(new ApiResponse(201, 'Diet Plan Created', result));
});

export const getDietByMember = asyncHandler(async (req, res) => {
  const data = await DietService.getDietByMember(req.params.memberId);
  res.json(new ApiResponse(HTTPSTATUS.OK, 'Diet Plan Fetched', data));
});

export const updateDietPlan = asyncHandler(async (req, res) => {
  const updated = await DietService.updateDietPlan(req.params.id, req.body);
  res.json(new ApiResponse(HTTPSTATUS.OK, 'Diet Plan Updated', updated));
});
