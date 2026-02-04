import { Schema, model, Types } from 'mongoose'
import bcrypt from 'bcryptjs'
import { IUser } from '@/types/user.types'

// user schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 2
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      default: 'member',
      enum: ['admin', 'staff', 'trainer', 'member']
    },
    memberId: {
      type: String
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    },
    assignedPackage: {
      type: Schema.Types.ObjectId,
      ref: 'FeePackage'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

// compare password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next

  this.password = await bcrypt.hash(this.password, 10)
})

// indexing
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ memberId: 1 }, { unique: true, sparse: true })
userSchema.index({ role: 1, status: 1 })
userSchema.index({ status: 1 })
userSchema.index({ name: 1 })
userSchema.index({ assignedPackage: 1 })
userSchema.index({ createdAt: -1 })

export const User = model<IUser>('User', userSchema)
export default User
