import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  entityType: string;
  entityId?: mongoose.Types.ObjectId;
  details?: Record<string, any>;
  createdAt: Date; // Using createdAt from timestamps: true as the activity timestamp
}

const ActivitySchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // References the User model
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  entityType: {
    type: String,
    required: true,
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  details: {
    type: Schema.Types.Mixed, // Flexible object for additional context
    required: false,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// Indexes for efficient retrieval
ActivitySchema.index({ userId: 1 });
ActivitySchema.index({ action: 1 });
ActivitySchema.index({ entityType: 1, entityId: 1 });
ActivitySchema.index({ createdAt: -1 }); // Index for time-based queries

export default mongoose.model<IActivity>('Activity', ActivitySchema);