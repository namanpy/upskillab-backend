// src/schemas/feedback.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  teacherId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ClassSession', required: true })
  classSessionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Batch', required: true })
  batchId: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ type: String, required: false, maxlength: 1000 })
  message?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);