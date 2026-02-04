import { ISupplement } from '@/types/supplement.types'
import { Schema, model } from 'mongoose'

// Supplement Store Schema
const supplementSchema = new Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['protein', 'pre_workout', 'post_workout', 'vitamins', 'other'],
    required: true
  },
  brand: {
    type: String,
    trim: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  unit: {
    type: String,
    default: 'piece'
  },
  imageUrl: {
    type: String
  },
  isAvailable: {
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

export const Supplement = model('Supplement', supplementSchema)
