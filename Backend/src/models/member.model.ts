import { Schema, model } from 'mongoose';
import { IMember } from '../types/user.types';

const MemberModel = new Schema<IMember>({
  gymId: { type: Schema.Types.ObjectId, required: true, ref: 'Gym', index: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
  phone: { type: String },
  avatar: { type: String },
  membershipStatus: { type: String, enum: ['ACTIVE', 'INACTIVE', 'EXPIRED'], default: 'ACTIVE'},
  package_history: [{
    type: Schema.Types.ObjectId,
    ref: 'FeePackage'
  }],
  joinDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
}, { timestamps: true })

// index 
MemberModel.index({ gymId: 1, userId: 1 }, { unique: true })

export const Member = model<IMember>('Member', MemberModel);
export default Member;