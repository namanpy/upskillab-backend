import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { MongooseDocument } from './common.schema';
import { STUDENT_TYPE } from 'src/common/constants/student.constants';

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
}

export const StudentSchema = SchemaFactory.createForClass(Student);
