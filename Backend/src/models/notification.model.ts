import { Schema, model, Document, Types } from 'mongoose';
import { NotificationStatus, NotificationType } from '../enums/notification.enums';

export interface INotification extends Document {
  member: Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
}

const notificationSchema = new Schema<INotification>({
  member: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(NotificationType),
    default: NotificationType.NEW_BILL,
  },
  status: {
    type: String,
    enum: Object.values(NotificationStatus),
    default: NotificationStatus.SENT,
  },
});

export const Notification = model<INotification>('Notification', notificationSchema);
export default Notification;
