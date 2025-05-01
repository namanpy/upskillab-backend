/**
 *
 * Reference - https://docs.nestjs.com/techniques/mongodb
 *
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import {
  COURSE_LEVELS,
  COURSE_MODE,
} from 'src/common/constants/course.constants';
import { Category } from '../category.schema';
import { Language } from '../language.schema';

export type CourseDocuments = HydratedDocument<Course>;

@Schema()
class FAQ {
  @ApiProperty()
  @Prop({
    required: true,
  })
  question: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  answer: string;
}

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
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name })
  category: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
    unique: true,
  })
  courseCode: string;

  @ApiProperty()
  @Prop({
    required: false,
  })
  courseImage: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    enum: Object.keys(COURSE_MODE),
  })
  courseMode: string;

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
    type: String,
    default: null,
  })
  youtubeUrl: string | null;

  @ApiPropertyOptional()
  @Prop({
    required: false,
  })
  brochure?: string;

  @ApiProperty()
  @Prop({
    required: true,
    enum: Object.keys(COURSE_LEVELS),
  })
  courseLevel: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Language.name })
  language: Types.ObjectId;

  @ApiPropertyOptional()
  @Prop({
    required: false,
  })
  certificate?: string;

  @ApiProperty()
  @Prop({
    required: true,
    default: true,
  })
  active: boolean;

  @ApiProperty({ type: [FAQ] })
  @Prop({
    type: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    default: [],
  })
  faqs: FAQ[];

  @ApiProperty()
  @Prop({
    required: true,
  })
  shortDescription: string;

  @ApiProperty({ type: [String] })
  @Prop({
    type: [String],
    required: true,
    default: [],
  })
  tags: string[];

  @ApiProperty()
  @Prop({
    required: true,
  })
  programDetails: string;

  @ApiProperty({ type: [String] })
  @Prop({
    type: [String],
    required: true,
    default: [],
  })
  targetAudience: string[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
