// models/supplement.model.ts
import { Schema, model, Document } from 'mongoose';

export interface ISupplement extends Document {
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  isActive: boolean;
}

const supplementSchema = new Schema<ISupplement>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, trim: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Supplement = model<ISupplement>('Supplement', supplementSchema);
export default Supplement;
