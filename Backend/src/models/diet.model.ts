import { Schema, model } from 'mongoose';
import { IDietPlan } from '../types/user.types';

const DietModel = new Schema<IDietPlan>({
  gymId: { type: Schema.Types.ObjectId, required: true, ref: 'Gym', index: true },

  title: { type: String, required: true },
  description: { type: String, required: true },

  isActive: { type: Boolean, default: true },

  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' } // diet created by admin or trainer
}, { timestamps: true })

// index 
DietModel.index({ gymId: 1 });

export const Diet = model<IDietPlan>('Diet', DietModel);
export default Diet;