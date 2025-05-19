import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  @Prop({ type: Types.ObjectId, required: true, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  jobId: Types.ObjectId;

  @Prop({
    type: {
      collegeName: { type: String, required: true },
      passingYear: { type: Number, required: true },
      branch: { type: String, required: true },
    },
    required: true,
  })
  qualification: {
    collegeName: string;
    passingYear: number;
    branch: string;
  };

  @Prop({ required: true })
  resumeUrl: string;

  @Prop({ type: String, enum: ['upskill', 'external'], required: false })
  source: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

// Create unique indexes for email + jobId and phoneNumber + jobId
export const ApplicationSchema = SchemaFactory.createForClass(Application);

// Add unique compound indexes
ApplicationSchema.index({ email: 1, jobId: 1 }, { unique: true });
ApplicationSchema.index({ phoneNumber: 1, jobId: 1 }, { unique: true });