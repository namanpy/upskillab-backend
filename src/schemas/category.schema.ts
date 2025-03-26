/**
 *
 * Reference - https://docs.nestjs.com/techniques/mongodb
 *
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { COURSE_MODE } from 'src/common/constants/course.constants';

export type CategoryDocuments = HydratedDocument<Course>;

@Schema()
export class Course {
  @ApiProperty()
  @Prop({
    required: true,
  })
  categoryName: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  categoryCode: string;

  @ApiProperty()
  @Prop({
    required: true,
    default: true,
  })
  active: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.index({
  categoryCode: 1,
});
