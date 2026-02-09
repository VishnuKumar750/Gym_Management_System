import { INotification } from '@/modules/notification/notification.types'
import { Schema, model } from 'mongoose'

// Notification Schema
const notificationSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['payment_due', 'payment_received', 'general', 'holiday', 'event', 'urgent'],
    default: 'general'
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isSent: {
    type: Boolean,
    default: false
  },
  sentDate: {
    type: Date
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
})
// index
notificationSchema.index({ recipients: 1 })

export const Notification = model('Notification', notificationSchema)
