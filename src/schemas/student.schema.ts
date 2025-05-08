// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { HydratedDocument, Types } from 'mongoose';
// import { MongooseDocument } from './common.schema';
// import { STUDENT_TYPE } from 'src/common/constants/student.constants';

// export type StudentDocument = HydratedDocument<Student>;
// @Schema({ timestamps: true })
// export class Student extends MongooseDocument {
//   @ApiProperty({ description: 'Reference to the user' })
//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   user: Types.ObjectId;

//   @ApiProperty({ description: 'Full name of the student' })
//   @Prop({ required: true })
//   fullName: string;

//   @ApiPropertyOptional({ description: 'College name of the student' })
//   @Prop()
//   college?: string;

//   @ApiProperty({
//     description: 'Type of student',
//     enum: Object.keys(STUDENT_TYPE),
//   })
//   @Prop({ required: true, enum: Object.keys(STUDENT_TYPE) })
//   studentType: string;
// }

// export const StudentSchema = SchemaFactory.createForClass(Student);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { MongooseDocument } from './common.schema';
import { STUDENT_TYPE } from 'src/common/constants/student.constants';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true })
export class Student extends MongooseDocument {
  @ApiProperty({ description: 'Reference to the user' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @ApiProperty({ description: 'Full name of the student' })
  @Prop({ required: true })
  fullName: string;

  @ApiPropertyOptional({ description: 'College name of the student' })
  @Prop()
  college?: string;

  @ApiProperty({
    description: 'Type of student',
    enum: Object.keys(STUDENT_TYPE),
  })
  @Prop({ required: true, enum: Object.keys(STUDENT_TYPE) })
  studentType: string;

  @ApiPropertyOptional({ description: 'Profile image URL of the student' })
  @Prop()
  image?: string;

  @ApiPropertyOptional({ description: 'Bio of the student' })
  @Prop()
  bio?: string;

  @ApiPropertyOptional({ description: 'Skills of the student', type: [String] })
  @Prop({ type: [String], default: [] })
  skills?: string[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);