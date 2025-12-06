import { Schema, model, Document } from 'mongoose';
import { MembershipPlan } from '../enums/day.enums';

export interface IFeePackage extends Document {
  plan: MembershipPlan;
  durationInMonths: number;
  amount: number;
  description?: string;
  isActive: boolean;
}

const feePackageSchema = new Schema<IFeePackage>(
  {
    plan: {
      type: String,
      enum: Object.values(MembershipPlan),
      required: true,
    },
    durationInMonths: {
      type: Number,
      required: true,
      min: 1,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const FeePackage = model<IFeePackage>('FeePackage', feePackageSchema);
export default FeePackage;
