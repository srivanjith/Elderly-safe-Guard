import mongoose, { Schema, Document } from 'mongoose';

export interface IGuardianRelationship extends Document {
  userId: mongoose.Types.ObjectId;
  guardianId: mongoose.Types.ObjectId;
  relationship: string;
  isPrimary: boolean;
  createdAt: Date;
}

const GuardianRelationshipSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    guardianId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    relationship: { 
      type: String, 
      required: true, 
      enum: ['Son', 'Daughter', 'Spouse', 'Family Member', 'Trusted Friend'] 
    },
    isPrimary: { type: Boolean, default: false }
  },
  { timestamps: true }
);

GuardianRelationshipSchema.index({ userId: 1, guardianId: 1 }, { unique: true });

export default mongoose.model<IGuardianRelationship>('GuardianRelationship', GuardianRelationshipSchema);
