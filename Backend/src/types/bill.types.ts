import { Types, Document } from 'mongoose'

// interface
export interface IBill extends Document {
  billNumber: string
  member: Types.ObjectId
  package: Types.ObjectId
  amount: number
  paymentDate: Date
  paymentMethod: string
  validFrom: Date
  validUntil: Date
  status: string
  discount?: number
  taxAmount?: number
  finalAmount: number
  remarks?: string
  createdBy?: Types.ObjectId
  createdAt?: Date
}

// interface
export interface IBillForm {
  userId?: Types.ObjectId
  invoiceNumber?: string
  issueDate?: Date
  dueDate?: Date
  durationMonth?: string
  amount?: number
  status?: 'pending' | 'paid' | 'refunded'
  paidAt?: Date
  paymentMethod?: string
  transactionId?: string
  receiptUrl?: string
  feePackageId?: Types.ObjectId
  createdBy?: Types.ObjectId
}
