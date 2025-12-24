import mongoose, { Schema, Document } from 'mongoose';

export interface ICrop extends Document {
  name: string;
  variety: string;
  season: string;
  sowingDate: Date;
  harvestDate?: Date;
  farmer: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CropSchema: Schema = new Schema({
  name: { type: String, required: true },
  variety: { type: String, required: true },
  season: { type: String, required: true },
  sowingDate: { type: Date, required: true },
  harvestDate: { type: Date },
  farmer: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export default mongoose.model<ICrop>('Crop', CropSchema);
