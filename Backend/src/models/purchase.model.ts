// models/purchase.model.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IPurchase extends Document {
  member: Types.ObjectId;
  supplement: Types.ObjectId;
  quantity: number;
  totalAmount: number;
  paymentStatus: 'PAID' | 'UNPAID';
  purchaseDate: Date;
}

const purchaseSchema = new Schema<IPurchase>(
  {
    member: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    supplement: { type: Schema.Types.ObjectId, ref: 'Supplement', required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['PAID', 'UNPAID'], default: 'UNPAID' },
    purchaseDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Purchase = model<IPurchase>('Purchase', purchaseSchema);
export default Purchase;
