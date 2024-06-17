import mongoose, { Schema, Document } from 'mongoose';

interface IDrone extends Document {
  serialNumber: string;
  model: string;
  weightLimit: number;
  batteryCapacity: number;
  state: string;
  medications: Schema.Types.ObjectId[];
}

const droneSchema = new Schema<IDrone>({
  serialNumber: { type: String, required: true, maxlength: 100, unique: true },
  model: { type: String, required: true },
  weightLimit: { type: Number, required: true, max: 500 },
  batteryCapacity: { type: Number, required: true },
  state: { type: String, required: true, enum: ['IDLE', 'LOADING', 'LOADED', 'DELIVERING', 'DELIVERED', 'RETURNING'] },
  medications: [{ type: Schema.Types.ObjectId, ref: 'Medication' }]
});

const Drone = mongoose.model<IDrone>('Drone', droneSchema);
export default  Drone;
