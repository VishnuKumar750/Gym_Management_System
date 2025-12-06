export enum NotificationType {
  PAYMENT_REMINDER = 'payment_reminder',
  PAYMENT_OVERDUE = 'payment_overdue',
  MEMBERSHIP_EXPIRY = 'membership_expiry',
  RENEWAL_REMINDER = 'renewal_reminder',
  BIRTHDAY = 'birthday',
  DIET_PLAN_UPDATED = 'diet_plan_updated',
  NEW_BILL = 'new_bill',
  PAYMENT_SUCCESS = 'payment_success',
  CUSTOM = 'custom',
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  PUSH = 'push',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  READ = 'read',
  CANCELLED = 'cancelled',
}
