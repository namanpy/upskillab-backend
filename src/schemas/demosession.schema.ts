/**
 * Reference - https://docs.nestjs.com/techniques/mongodb
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type DemoSessionDocument = HydratedDocument<DemoSession> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class DemoSession {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  fullName: string;

  @ApiProperty()
  @Prop({ required: true })
  email: string;

  @ApiProperty()
  @Prop({ required: true })
  phoneNumber: string;

  @ApiProperty()
  @Prop({ required: true, enum: ['Fresher', 'Working Professional'] })
  course: string;
}

export const DemoSessionSchema = SchemaFactory.createForClass(DemoSession);