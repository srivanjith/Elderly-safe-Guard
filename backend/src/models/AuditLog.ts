import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId?: mongoose.Types.ObjectId;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
