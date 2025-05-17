import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true })
export class Attendance {
  @ApiProperty()
  @Prop({ required: true, auto: true })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ ref: 'ClassSession', required: true })
  classId: Types.ObjectId;

  @ApiProperty()
  @Prop({ ref: 'User', required: true })
  userId: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, default: false })
  isAttended: boolean;

  @ApiProperty()
  @Prop()
  createdAt: Date;

  @ApiProperty()
  @Prop()
  updatedAt: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
