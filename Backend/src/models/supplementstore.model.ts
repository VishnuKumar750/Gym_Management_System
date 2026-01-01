import { Schema, model } from 'mongoose';
import { ISupplement } from '../types/user.types';

const SupplementModel = new Schema<ISupplement>({
  gymId: { type: Schema.Types.ObjectId, required: true, ref: 'Gym', index: true },

  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: {
  type: String,
  enum: [
    'PROTEIN',
    'PRE_WORKOUT',
    'RECOVERY',
    'VITAMINS',
    'WEIGHT_LOSS'
  ],
  required: true
}
}, { timestamps: true })

// index 
SupplementModel.index({ gymId: 1, name: 1 }, { unique: true });

export const Supplement = model<ISupplement>('Supplement', SupplementModel);
export default Supplement;