import { Schema, model } from 'mongoose'

// Fee Package Schema
const packageSchema = new Schema({
  packageName: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true, // in months
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  features: [
    {
      type: String
    }
  ],
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const Package = model('FeePackage', packageSchema)
