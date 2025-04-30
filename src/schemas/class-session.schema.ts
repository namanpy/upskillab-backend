// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';
// import { ApiProperty } from '@nestjs/swagger';
// import * as mongoose from 'mongoose';

// export type ClassSessionDocument = ClassSession & Document;

// @Schema({ timestamps: true })
// export class ClassSession {
//   @ApiProperty()
//   @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, auto: true }) // Explicitly define _id as ObjectId
//   _id: mongoose.Types.ObjectId;

//   @ApiProperty()
//   @Prop({ required: true })
//   title: string;

//   @ApiProperty()
//   @Prop()
//   description: string;

//   @ApiProperty()
//   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true })
//   batchId: string;

//   @ApiProperty()
//   @Prop({ required: true })
//   scheduledDate: Date;

//   @ApiProperty()
//   @Prop({ required: true })
//   scheduledStartTime: string;

//   @ApiProperty()
//   @Prop({ required: true })
//   scheduledEndTime: string;

//   @ApiProperty()
//   @Prop({ required: true })
//   meetingLink: string;

//   @ApiProperty()
//   @Prop()
//   meetingPassword: string;

//   @ApiProperty()
//   @Prop({ required: true, enum: ['zoom', 'google_meet', 'ms_teams'] })
//   meetingPlatform: string;

//   @ApiProperty()
//   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true })
//   teacherId: string;

//   @ApiProperty()
//   @Prop({ required: true })
//   isRecorded: boolean;

//   @ApiProperty()
//   @Prop()
//   recordingUrl: string;

//   @ApiProperty()
//   @Prop()
//   createdAt: Date;

//   @ApiProperty()
//   @Prop()
//   updatedAt: Date;
// }

// export const ClassSessionSchema = SchemaFactory.createForClass(ClassSession);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
// import { HydratedDocument, Types } from 'mongoose';

export type ClassSessionDocument = ClassSession & Document;

@Schema({ timestamps: true })
export class ClassSession {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, auto: true })
  _id: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true })
  batchId: string;

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
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true })
  teacherId: string;

  @ApiProperty()
  @Prop({ required: true })
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