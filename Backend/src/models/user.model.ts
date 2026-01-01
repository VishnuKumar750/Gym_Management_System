import { Schema, model } from 'mongoose';
import { IUser } from '../types/user.types';
import { config } from '../config/app.config';
import bcrypt from 'bcrypt'

// user schema 
const UserModel = new Schema<IUser>({
  gymId: { type: Schema.Types.ObjectId, required: true, ref: 'Gym', index: true },
  name: { type: String, required: true, minlength: 3, maxlength: 12 },
  email: { type: String, required: true, },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['ADMIN', 'STAFF', 'TRAINER', 'MEMBER'], required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
})

// indexing { email, gymId, role } for faster query search 
UserModel.index({ email: 1, gymId: 1 }, { unique: true });
UserModel.index({ role: 1 });

// compare password 
UserModel.methods.comparePassword = async function ( password: string ) {
  return await bcrypt.compare(password, this.password);
}

// hash password before save
UserModel.pre('save', async function (next) {
  if(!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(config.BCRYPT_SALT);
  this.password = await bcrypt.hash(this.password, salt);

  next();
})

export const User = model<IUser>('User', UserModel);
export default User;