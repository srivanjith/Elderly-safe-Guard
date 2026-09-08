import mongoose, { Schema, Document } from 'mongoose';

export interface IFundRequest extends Document {
  requesterId: mongoose.Types.ObjectId;
  guardianId: mongoose.Types.ObjectId;
  amount: number;
  note?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

const FundRequestSchema: Schema = new Schema(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    guardianId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    note: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    }
  },
  { timestamps: true }
);

export default mongoose.model<IFundRequest>('FundRequest', FundRequestSchema);
