export type NotificationType =
  | "payment_due"
  | "payment_received"
  | "general"
  | "holiday"
  | "event"
  | "urgent";

export interface INotification {
  _id: string;

  title: string;
  message: string;
  type: NotificationType;

  recipient?: {
    _id: string;
    name: string;
  };

  isSent: boolean;
  sentDate?: string;

  createdBy: {
    _id: string;
    name: string;
  };
}
