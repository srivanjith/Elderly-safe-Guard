import mongoose, { Schema, Document } from 'mongoose';

export type TransactionStatus = 
  | 'CREATED'
  | 'RISK_ANALYSIS'
  | 'PROCESSING'
  | 'PENDING_GUARDIAN_APPROVAL'
  | 'APPROVED'
  | 'BLOCKED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ITransaction extends Document {
  senderId: mongoose.Types.ObjectId;
  recipientName: string;
  recipientId: string;
  amount: number;
  note?: string;
  status: TransactionStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  riskReasons: string[];
  guardianId?: mongoose.Types.ObjectId;
  guardianDecision?: 'APPROVE' | 'BLOCK' | 'EXPIRED';
  guardianDecisionTime?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientName: { type: String, required: true, trim: true },
    recipientId: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    note: { type: String, default: '' },
    status: {
      type: String,
      enum: [
        'CREATED',
        'RISK_ANALYSIS',
        'PROCESSING',
        'PENDING_GUARDIAN_APPROVAL',
        'APPROVED',
        'BLOCKED',
        'COMPLETED',
        'CANCELLED',
        'EXPIRED'
      ],
      default: 'CREATED'
    },
    riskScore: { type: Number, default: 0 },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
    riskReasons: [{ type: String }],
    guardianId: { type: Schema.Types.ObjectId, ref: 'User' },
    guardianDecision: { type: String, enum: ['APPROVE', 'BLOCK', 'EXPIRED'] },
    guardianDecisionTime: { type: Date },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
