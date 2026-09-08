import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'ELDERLY_USER' | 'GUARDIAN' | 'ADMIN';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  walletBalance: number;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['ELDERLY_USER', 'GUARDIAN', 'ADMIN'], 
      default: 'ELDERLY_USER' 
    },
    walletBalance: { type: Number, default: 150000 },
    phone: { type: String, default: '' },
    avatar: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
