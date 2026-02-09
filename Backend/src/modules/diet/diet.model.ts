import { model, Schema } from 'mongoose'

// Diet Plan Schema
const dietPlanSchema = new Schema({
  member: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planName: {
    type: String,
    required: true,
    trim: true
  },
  goal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'maintenance', 'athletic_performance'],
    required: true
  },
  calories: {
    daily: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  },
  notes: {
    type: String
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export const DietPlan = model('DietPlan', dietPlanSchema)
