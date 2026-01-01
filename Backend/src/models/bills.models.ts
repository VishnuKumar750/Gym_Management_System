import { Schema, model } from 'mongoose';
import { IBill } from '../types/user.types';

const BillModel = new Schema<IBill>({
  gymId: { type: Schema.Types.ObjectId, required: true, ref: 'Gym', index: true },
  memberId: { type: Schema.Types.ObjectId, required: true, ref: 'Member', index: true },

  packageSnapshot: { 
    title: { type: String, required: true },
    durationMonths: { type: Number, required: true },
    amount: { type: Number, required: true },
  },

  amountPaid: { type: Number, required: true },
  paymentMode: { type: String, enum: ['UPI', 'CARD', 'CASH'], required: true },
  paymentStatus: { type: String, enum: ['SUCCESS', 'FAILED', 'REFUNDED' ], required: true },
  paymentDate: { type: Date, default: Date.now },
}, { timestamps: true })

// index 
BillModel.index({ gymId: 1, memberId: 1 });
BillModel.index({ paymentDate: -1 })

export const Bill = model<IBill>('Bill', BillModel);
export default Bill;