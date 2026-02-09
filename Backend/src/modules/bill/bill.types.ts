import { Types, Document } from 'mongoose'

// interface
export interface IBill extends Document {
  billNumber: string
  memberId: Types.ObjectId
  packageId: Types.ObjectId
  paymentDate: Date
  paymentMethod: string
  status: string
  amount?: number
  discount?: number
  taxAmount?: number
  finalAmount: number
  remarks?: string
  createdBy?: Types.ObjectId
  createdAt?: Date
  updatedAt?: Date
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
