/**
 * Reference - https://docs.nestjs.com/techniques/mongodb
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type StoryDocument = HydratedDocument<Story> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Story {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  jobTitle: string;

  @ApiProperty()
  @Prop({ required: true })
  userImageUrl: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @ApiProperty()
  @Prop({ required: true })
  companyLogoUrl: string;

  @ApiProperty()
  @Prop({ required: true })
  role: string; // New field

  @ApiProperty()
  @Prop({ required: true })
  companyName: string; // New field

  @ApiProperty()
  @Prop({ required: true })
  before: string; // New field

  @ApiProperty()
  @Prop({ required: true })
  after: string; // New field

  @ApiProperty({ type: [String] })
  @Prop({ type: [String], required: true })
  skills: string[]; // New field, array of strings

  @ApiProperty()
  @Prop({ required: true })
  duration: string;

  @ApiProperty()
  @Prop({ required: true })
  batch_Year: string;

  @ApiProperty()
  @Prop({ required: true })
  salaryIncrease: string;
  
  @ApiProperty()
  @Prop({ default: false })
  wallOfFame: boolean; // New field, defaults to false
}

export const StorySchema = SchemaFactory.createForClass(Story);