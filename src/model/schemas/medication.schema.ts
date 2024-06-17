
import mongoose, { Schema, Document } from 'mongoose';

interface IMedication extends Document {
  name: string;
  weight: number;
  code: string;
  image: string;
}

const medicationSchema = new Schema<IMedication>({
  name: { type: String, required: true, match: /^[A-Za-z0-9-_]+$/ },
  weight: { type: Number, required: true },
  code: { type: String, required: true, match: /^[A-Z0-9_]+$/ },
  image: { type: String, required: true }
});

export const Medication = mongoose.model<IMedication>('Medication', medicationSchema);
