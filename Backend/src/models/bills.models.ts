import { PaymentMethod } from './../enums/bill.enums';
import { Schema, model, Document } from 'mongoose';
import { Types } from 'mongoose';
import { BillStatus } from '../enums/bill.enums';

export interface IBill extends Document {
  member: Types.ObjectId;
  billNumber: string;
  amount: number;
  dueDate: Date;
  status: BillStatus;
  paymentMethod?: PaymentMethod | null;
  paidDate?: Date | null;
}

const BillSchema = new Schema<IBill>(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    billNumber: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BillStatus),
      default: BillStatus.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: null,
    },
    paidDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Bill = model<IBill>('IBill', BillSchema);
export default Bill;
