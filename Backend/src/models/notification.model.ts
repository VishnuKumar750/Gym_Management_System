import { Schema, model } from 'mongoose';
import { INotification } from '../types/user.types';

const NotificationMember = new Schema<INotification>({
  gymId: { type: Schema.Types.ObjectId, required: true, ref: 'Gym', index: true },
  memberId: { type: Schema.Types.ObjectId, required: true, ref: 'Member', index: true },

  notificationType: { type: String, enum: ['FEE_REMINDER', 'ANNOUNCEMENT', 'EXPIRY_ALERT'], required: true },
  message: { type: String, required: true },
  sentStatus: { type: String, enum: ['SENT', 'FAILED'], required: true },
  sentAt: { type: Date, default: Date.now }

}, { timestamps: true })

// index 
NotificationMember.index({ gymId: 1, memberId: 1 });
NotificationMember.index({ gymId: 1, notificationType: 1 });

export const Notification = model<INotification>('Notification', NotificationMember);
export default Notification;