import { Schema, model, Types } from 'mongoose'
import { IBill } from './bill.types'

// Bill/Receipt Schema
const billSchema = new Schema<IBill>({
  billNumber: {
    type: String,
    required: true
  },
  memberId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packageId: {
    type: Schema.Types.ObjectId,
    ref: 'FeePackage',
    required: true
  },
  amount: {
    type: Number,
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
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// index
billSchema.index({ billNumber: 1 })
billSchema.index({ memberId: 1, packageId: 1 })
billSchema.index({ status: 1 })

export const Bill = model<IBill>('Bill', billSchema)
