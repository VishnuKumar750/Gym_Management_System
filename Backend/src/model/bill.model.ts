import { IBill } from '@/types/bill.types'
import { Schema, model, Types } from 'mongoose'

// Bill/Receipt Schema
const billSchema = new Schema<IBill>({
  billNumber: {
    type: String,
    required: true,
    unique: true
  },
  member: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  package: {
    type: Schema.Types.ObjectId,
    ref: 'FeePackage',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'netbanking', 'other'],
    default: 'cash'
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'overdue', 'cancelled'],
    default: 'paid'
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  finalAmount: {
    type: Number,
    required: true
  },
  remarks: {
    type: String
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// index
billSchema.index({ member: 1 })

export const Bill = model<IBill>('Bill', billSchema)
