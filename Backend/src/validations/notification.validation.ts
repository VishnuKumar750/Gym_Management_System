import { z } from 'zod';
import { NotificationType } from '../enums/notification.enums';

export const createNotificationSchema = z.object({
  body: z.object({
    member: z.string({ required_error: 'Member ID required' }),
    title: z.string().min(3),
    message: z.string().min(5),
    type: z.nativeEnum(NotificationType).optional(),
  }),
});
