import { Schema, model, Document, Types } from 'mongoose';

export interface IPackageHistory {
  packageId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  amount: number;
  paymentStatus: 'PAID' | 'UNPAID';
}

export interface IMember extends Document {
  user: Types.ObjectId;
  memberId: string;
  fullName: string;
  phone: string;
  age: number;
  membership?: {
    plan: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  };
  packageHistory: IPackageHistory[];
}

const memberSchema = new Schema<IMember>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    memberId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true, min: 15 },

    membership: {
      plan: { type: Schema.Types.ObjectId, ref: 'FeePackage' },
      startDate: Date,
      endDate: Date,
      status: {
        type: String,
        enum: ['ACTIVE', 'EXPIRED', 'PENDING'],
        default: 'PENDING',
      },
    },

    packageHistory: [
      {
        packageId: { type: Schema.Types.ObjectId, ref: 'FeePackage' },
        startDate: Date,
        endDate: Date,
        amount: { type: Number },
        paymentStatus: {
          type: String,
          enum: ['PAID', 'UNPAID'],
          default: 'UNPAID',
        },
      },
    ],
  },
  { timestamps: true }
);

export const Member = model<IMember>('Member', memberSchema);
export default Member;
