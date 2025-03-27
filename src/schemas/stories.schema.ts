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
}

export const StorySchema = SchemaFactory.createForClass(Story);