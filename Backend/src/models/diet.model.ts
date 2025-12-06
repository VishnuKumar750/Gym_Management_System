// models/diet.model.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IMeal {
  mealType: string;
  foodItems: string[];
  calories: number;
}

export interface IDietPlan extends Document {
  member: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  meals: IMeal[];
  notes?: string;
  status: 'ACTIVE' | 'COMPLETED';
}

const mealSchema = new Schema<IMeal>({
  mealType: { type: String, required: true },
  foodItems: [{ type: String, required: true }],
  calories: { type: Number, required: true },
});

const dietPlanSchema = new Schema<IDietPlan>(
  {
    member: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    meals: [mealSchema],
    notes: String,
    status: { type: String, enum: ['ACTIVE', 'COMPLETED'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

export const DietPlan = model<IDietPlan>('DietPlan', dietPlanSchema);
export default DietPlan;
