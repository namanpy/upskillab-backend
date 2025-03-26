/**
 *
 * Reference - https://docs.nestjs.com/techniques/mongodb
 *
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Course } from './course.schema';
export type BatchDocuments = HydratedDocument<Batch>;

@Schema()
export class Batch {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

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
