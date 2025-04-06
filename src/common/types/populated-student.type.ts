// src/types/populated-student.type.ts
import { Document } from 'mongoose';

export interface PopulatedStudent extends Document {
  name: string;
}