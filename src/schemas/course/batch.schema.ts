import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Course } from './course.schema';
import { Teacher } from '../teacher.schema';

export type BatchDocument = HydratedDocument<Batch> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Batch {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Course.name,
    required: true,
  })
  course: Types.ObjectId;

  @ApiProperty({
    description: 'Start time in 24-hour format (hh:mm)',
    example: '14:30',
  })
  @Prop({
    required: true,
    match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, // Validates time format hh:mm
  })
  startTime: string;

  @ApiProperty()
  @Prop({ required: true })
  startDate: Date;

  @ApiProperty()
  @Prop({ required: true })
  totalSeats: number;

  @ApiProperty()
  @Prop({ required: true })
  remainingSeats: number;

  @ApiProperty()
  @Prop({ required: true })
  duration: number;

  @ApiProperty()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Teacher.name,
    required: true,
  })
  teacher: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  imageUrl: string;

  @ApiProperty()
  @Prop({ default: true })
  active: boolean;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);
