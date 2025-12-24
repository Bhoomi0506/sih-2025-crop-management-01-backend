import mongoose, { Schema, Document } from 'mongoose';

export interface IField extends Document {
  name: string;
  location: string;
  size: number; // in acres/hectares
  soilType: string;
  farmer: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FieldSchema: Schema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  size: { type: Number, required: true },
  soilType: { type: String },
  farmer: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<IField>('Field', FieldSchema);
