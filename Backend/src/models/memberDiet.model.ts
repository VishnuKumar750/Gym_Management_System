import { Schema, model } from 'mongoose';
import { IMemberDiet } from '../types/user.types';

const MemberDietModel = new Schema<IMemberDiet>({
	gymId: { type: Schema.Types.ObjectId, required: true, ref: 'Gym', index: true },
	memberId: { type: Schema.Types.ObjectId, required: true, ref: 'Member', index: true },

	dietPlanId: { type: Schema.Types.ObjectId, required: true, ref: 'Diet', index: true },
	startDate: { type: Date, default: Date.now },
	endDate: { type: Date },
	customNotes: { type: String },
	status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'CANCELLED']}
}, { timestamps: true })

// index 
MemberDietModel.index({ gymId: 1, memberId: 1, dietPlanId: 1 });

export const MemberDiet = model<IMemberDiet>('MemberDiet', MemberDietModel);
export default MemberDiet;

