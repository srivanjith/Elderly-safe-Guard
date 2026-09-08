import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  transactionId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' }
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
