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
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  course: Course | Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, min: 0, max: 24 })
  startTime: number;

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
    ref: 'Teacher',
    required: true,
  })
  teacher: Teacher | Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  imageUrl: string;

  @ApiProperty()
  @Prop({ default: true })
  active: boolean;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);
