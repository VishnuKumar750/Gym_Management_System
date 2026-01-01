import { Schema, model } from 'mongoose';
import { IFeePackage } from '../types/user.types';

const FeePackageModel = new Schema<IFeePackage>({
  gymId: { type: Schema.Types.ObjectId, required: true, ref: 'Gym', index: true },

  title: { type: String, required: true, minlength: 6, maxlength: 50 },
  durationMonth: { type: Number, required: true, enum: [1, 3, 6, 9, 12], default: 1 },
  amount: { type: Number, required: true, min: 0},

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// indexing for faster query
FeePackageModel.index({ gymId: 1, title: 1  }, { unique: true });
FeePackageModel.index({ durationMonth: 1 })

export const FeePackage = model<IFeePackage>('FeePackage', FeePackageModel);
export default FeePackage;