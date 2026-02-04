import { Types, Document } from 'mongoose'

// interface
export interface INotification extends Document {
  title: string
  message: string
  userId: Types.ObjectId
  type: string
  isRead: boolean
  sendDate: Date
  sendby: Types.ObjectId
}

// interface
export interface INotificationForm {
  title?: string
  message?: string
  userId?: Types.ObjectId
  type?: string
  isRead?: boolean
  sendDate?: Date
  sendby?: Types.ObjectId
}
