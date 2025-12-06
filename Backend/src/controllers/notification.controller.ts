import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.middleware';
import { NotificationService } from '../services/notification.service';
import { HTTPSTATUS } from '../config/http.config';
import { ApiResponse } from '../utils/apiResponse.utils';

// Create a new notification (manual or automatic)
export const createNotification = asyncHandler(async (req: Request, res: Response) => {
  const result = await NotificationService.createNotification(req.body);
  const response = new ApiResponse(HTTPSTATUS.CREATED, 'Notification sent', result);
  return res.status(response.statusCode).json(response);
});

// Fetch all notifications for a member
export const getMemberNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await NotificationService.getMemberNotifications(req.params.id);
  const response = new ApiResponse(HTTPSTATUS.OK, 'Notifications fetched', notifications);
  return res.status(response.statusCode).json(response);
});

// Mark a notification as read
export const markNotificationAsRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await NotificationService.markAsRead(req.params.id);
  const response = new ApiResponse(HTTPSTATUS.OK, 'Marked as read', notification);
  return res.status(response.statusCode).json(response);
});
