import { Types, Document } from 'mongoose'

// interface
export interface ISupplement extends Document {
  name: string
  productImage?: string
  description: string
  price: number
  stock: number
  category: string
  isAvailable: boolean
  createdby: Types.ObjectId
  deleted: boolean
}

// add supplement
export interface ISupplementForm {
  name?: string
  productImage?: string
  description?: string
  price?: number
  stock?: number
  category?: string
  isAvailable?: string
  createdBy?: Types.ObjectId
  deleted?: boolean
}
