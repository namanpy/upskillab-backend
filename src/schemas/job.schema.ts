import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ type: Types.ObjectId, required: true, default: () => new Types.ObjectId() })
  _id: Types.ObjectId; // Explicitly define _id type

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: false })
  logo: string;

  @Prop({ type: [String], required: true })
  skills: string[];

  @Prop({ type: [String], required: false })
  ExtraLink: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);