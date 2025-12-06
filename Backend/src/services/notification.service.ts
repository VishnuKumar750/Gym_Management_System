import Notification, { INotification } from '../models/notification.model';
import { NotificationType, NotificationStatus } from '../enums/notification.enums';

export class NotificationService {
  // Create a notification (manual or automatic)
  static async createNotification(data: Partial<INotification>) {
    return Notification.create(data);
  }

  // Automatic notification: when package assigned
  static async notifyPackageAssigned(
    memberId: string,
    plan: string,
    startDate: Date,
    endDate: Date
  ) {
    const title = 'New Membership Package Assigned';
    const message = `Your ${plan} package is active from ${startDate.toDateString()} to ${endDate.toDateString()}.`;
    return this.createNotification({
      member: memberId,
      title,
      message,
      type: NotificationType.RENEWAL_REMINDER,
      status: NotificationStatus.SENT,
    });
  }

  // Automatic notification: when a new bill is generated
  static async notifyBillGenerated(memberId: string, amount: number, dueDate: Date) {
    const title = 'New Bill Generated';
    const message = `A new bill of ₹${amount} has been generated. Due date: ${dueDate.toDateString()}.`;
    return this.createNotification({
      member: memberId,
      title,
      message,
      type: NotificationType.NEW_BILL,
      status: NotificationStatus.SENT,
    });
  }

  // Automatic notification: payment success
  static async notifyPaymentSuccess(memberId: string, amount: number) {
    const title = 'Payment Successful';
    const message = `Your payment of ₹${amount} was successful. Thank you!`;
    return this.createNotification({
      member: memberId,
      title,
      message,
      type: NotificationType.PAYMENT_SUCCESS,
      status: NotificationStatus.SENT,
    });
  }

  // Get all notifications for a member (sorted by most recent)
  static async getMemberNotifications(memberId: string) {
    return Notification.find({ member: memberId }).sort({ createdAt: -1 });
  }

  // Mark a notification as read
  static async markAsRead(notificationId: string) {
    return Notification.findByIdAndUpdate(
      notificationId,
      { status: NotificationStatus.READ },
      { new: true }
    );
  }
}
