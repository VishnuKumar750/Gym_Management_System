import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.middleware';
import { SupplementService } from '../services/supplement.service';
import { HTTPSTATUS } from '../config/http.config';
import { ApiResponse } from '../utils/apiResponse.utils';

export const createSupplement = asyncHandler(async (req: Request, res: Response) => {
  const supplement = await SupplementService.createSupplement(req.body);
  return res
    .status(HTTPSTATUS.CREATED)
    .json(new ApiResponse(HTTPSTATUS.CREATED, 'Supplement created', supplement));
});

export const getAllSupplements = asyncHandler(async (req: Request, res: Response) => {
  const supplements = await SupplementService.getAllSupplements();
  return res
    .status(HTTPSTATUS.OK)
    .json(new ApiResponse(HTTPSTATUS.OK, 'Supplements fetched', supplements));
});

export const getSupplement = asyncHandler(async (req: Request, res: Response) => {
  const supplement = await SupplementService.getSupplementById(req.params.id);
  return res
    .status(HTTPSTATUS.OK)
    .json(new ApiResponse(HTTPSTATUS.OK, 'Supplement fetched', supplement));
});

export const updateSupplement = asyncHandler(async (req: Request, res: Response) => {
  const supplement = await SupplementService.updateSupplement(req.params.id, req.body);
  return res
    .status(HTTPSTATUS.OK)
    .json(new ApiResponse(HTTPSTATUS.OK, 'Supplement updated', supplement));
});

export const deleteSupplement = asyncHandler(async (req: Request, res: Response) => {
  const supplement = await SupplementService.deleteSupplement(req.params.id);
  return res
    .status(HTTPSTATUS.OK)
    .json(new ApiResponse(HTTPSTATUS.OK, 'Supplement deleted', supplement));
});
