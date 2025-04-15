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
  @Prop({ required: true })
  course: string; // Kept as a regular string field

  @ApiProperty()
  @Prop()
  sourse?: string;

  @ApiProperty({ enum: ['Fresher', 'Working Professional'] })
  @Prop({ enum: ['Fresher', 'Working Professional'] })
  experience: string; // Added as an enum field
}

export const DemoSessionSchema = SchemaFactory.createForClass(DemoSession);