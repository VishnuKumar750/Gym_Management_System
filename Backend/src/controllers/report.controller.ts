// controllers/report.controller.ts
import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.middleware';
import { ReportService } from '../services/report.service';
import { HTTPSTATUS } from '../config/http.config';
import { ApiResponse } from '../utils/apiResponse.utils';

export const getRevenueReport = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, format } = req.query;

  const bills = await ReportService.getRevenueReport(startDate as string, endDate as string);

  if (format === 'csv') {
    const csvData = await ReportService.exportRevenueReportCSV(bills);
    res.header('Content-Type', 'text/csv');
    res.attachment('revenue_report.csv');
    return res.send(csvData);
  }

  const response = new ApiResponse(HTTPSTATUS.OK, 'Revenue Report', bills);
  return res.status(response.statusCode).json(response);
});
