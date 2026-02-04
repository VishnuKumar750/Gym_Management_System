import { Document, Types } from 'mongoose'

export interface IAddress {
  street?: string
  city?: string
  state?: string
  zipCode?: string
}

export type UserRole = 'admin' | 'staff' | 'trainer' | 'member'
export type UserStatus = 'active' | 'inactive' | 'suspended'
export type Gender = 'male' | 'female' | 'other'

export interface IUser extends Document {
  _id: Types.ObjectId

  name: string
  email: string
  password: string
  phone: string

  role: UserRole
  memberId?: string

  address?: IAddress
  dateOfBirth?: Date
  gender?: Gender

  status: UserStatus
  assignedPackage?: Types.ObjectId

  createdAt: Date
  updatedAt: Date

  // instance methods
  comparePassword(enteredPassword: string): Promise<boolean>
}
