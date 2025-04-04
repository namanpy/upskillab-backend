/**
 *
 * Reference - https://docs.nestjs.com/techniques/mongodb
 *
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Course } from './course.schema';
import { COURSE_MODE } from 'src/common/constants/course.constants';
export type BatchDocuments = HydratedDocument<Batch>;

@Schema()
export class Batch {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty({
    minimum: 0,
    maximum: 24,
  })
  @Prop({
    required: true,
    min: 0,
    max: 24,
  })
  startTime: number;

  @ApiProperty({
    minimum: 0,
    maximum: 24,
  })
  @Prop({
    required: true,
    default: COURSE_MODE.LIVE_ONLINE.code,
    enum: Object.keys(COURSE_MODE),
  })
  mode: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  startDate: Date;

  @ApiProperty()
  @Prop({
    required: true,
    min: 0,
  })
  totalSeats: number;

  @ApiProperty()
  @Prop({
    required: true,
    min: 0,
  })
  remainingSeats: number;

  @ApiProperty()
  @Prop({
    required: true,
    min: 0,
  })
  durationInDays: number;

  @ApiProperty()
  @Prop({
    required: true,
    default: true,
  })
  active: boolean;

  @ApiProperty({
    type: String,
    description: 'Reference to the associated course',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Course.name,
    required: true,
  })
  course: Types.ObjectId;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);
