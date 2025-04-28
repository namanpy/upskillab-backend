import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { Batch } from './course/batch.schema';
import { Course } from './course/course.schema';
import { Teacher } from './teacher.schema';

export type ClassSessionDocument = HydratedDocument<ClassSession>;

@Schema({ timestamps: true })
export class ClassSession {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: 'Batch' })
  batchId: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: 'Course' })
  courseId: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  scheduledDate: Date;

  @ApiProperty()
  @Prop({ required: true })
  scheduledStartTime: string;

  @ApiProperty()
  @Prop({ required: true })
  scheduledEndTime: string;

  @ApiProperty()
  @Prop({ required: true })
  meetingLink: string;

  @ApiProperty()
  @Prop()
  meetingPassword: string;

  @ApiProperty()
  @Prop({ required: true, enum: ['zoom', 'google_meet', 'ms_teams'] })
  meetingPlatform: string;

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: 'Teacher' })
  teacherId: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, default: false })
  isRecorded: boolean;

  @ApiProperty()
  @Prop()
  recordingUrl: string;

  @ApiProperty()
  @Prop()
  createdAt: Date;

  @ApiProperty()
  @Prop()
  updatedAt: Date;
}

export const ClassSessionSchema = SchemaFactory.createForClass(ClassSession);