import { Document, model, Schema } from 'mongoose';
import { UserRole } from '../enums/roles.enums';
import crypto from 'crypto';

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@+\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(UserRole),
        message: 'Invalid role',
      },
      default: UserRole.MEMBER,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

const PBKDF2SYNC = 10000;
const KEYLEN = 64;
const DIGEST = 'sha512';

const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2SYNC, KEYLEN, DIGEST).toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (candidate: string, storedHash: string): boolean => {
  if (!storedHash || typeof storedHash !== 'string') {
    return false;
  }

  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;

  const [salt, originalHash] = parts;
  if (!salt || !originalHash) return false;

  const hash = crypto.pbkdf2Sync(candidate, salt, PBKDF2SYNC, KEYLEN, DIGEST).toString('hex');
  return hash === originalHash;
};

UserSchema.pre<IUser>('save', async function (this: IUser) {
  if (!this.isModified('password')) return;
  if (!this.password) throw new Error('password is required');

  this.password = hashPassword(this.password);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return verifyPassword(candidatePassword, this.password);
};

export const User = model<IUser>('User', UserSchema);
export default User;
