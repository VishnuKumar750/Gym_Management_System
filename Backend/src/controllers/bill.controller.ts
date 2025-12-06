import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.middleware';
import { BillService } from '../services/bill.service';
import { ApiResponse } from '../utils/apiResponse.utils';

export const createBill = asyncHandler(async (req: Request, res: Response) => {
  const bill = await BillService.createBill(req.body);
  return res.status(201).json(new ApiResponse(201, 'Bill created successfully', bill));
});

export const updateBillStatus = asyncHandler(async (req: Request, res: Response) => {
  const updatedBill = await BillService.markBillPaid(req.params.id, req.body);
  return res.json(new ApiResponse(200, 'Bill status updated', updatedBill));
});

export const getMemberBills = asyncHandler(async (req, res) => {
  const bills = await BillService.getMemberBills(req.params.memberId);
  return res.json(new ApiResponse(200, 'Member bills fetched', bills));
});
