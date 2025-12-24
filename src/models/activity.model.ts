import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  type: string;
  date: Date;
  description: string;
  crop: mongoose.Types.ObjectId;
  field: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema: Schema = new Schema({
  type: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  crop: { type: Schema.Types.ObjectId, ref: 'Crop', required: true },
  field: { type: Schema.Types.ObjectId, ref: 'Field', required: true }
}, { timestamps: true });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
