/**
 *
 * Reference - https://docs.nestjs.com/techniques/mongodb
 *
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { COURSE_MODE } from 'src/common/constants/course.constants';
import { Category } from './category.schema';

export type CourseDocuments = HydratedDocument<Course>;

@Schema()
export class Course {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
  })
  courseName: string;

  @ApiProperty()
  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: Category.name } })
  category: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
    unique: true,
  })
  courseCode: string;

  @ApiProperty()
  @Prop({
    required: true,
    enum: Object.keys(COURSE_MODE),
  })
  courseMode: keyof typeof COURSE_MODE;

  @ApiProperty()
  @Prop({
    required: true,
    min: 0,
  })
  courseDuration: number;

  @ApiProperty()
  @Prop({
    required: true,
    min: 0,
  })
  originalPrice: number;

  @ApiProperty()
  @Prop({
    required: true,
    min: 0,
  })
  discountedPrice: number;

  @ApiProperty()
  @Prop({
    required: false,
    default: null,
  })
  youtubeUrl: string | null;

  @ApiProperty()
  @Prop({
    required: true,
    default: true,
  })
  active: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
