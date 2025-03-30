/**
 * Reference - https://docs.nestjs.com/techniques/mongodb
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type ChapterDocument = HydratedDocument<Chapter> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Chapter {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  videoLink: string; // Changed from description to videoLink

  @ApiProperty()
  @Prop({ required: true })
  order: number;

  @ApiProperty({ type: String })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @ApiProperty()
  @Prop({ default: false })
  isPublished: boolean;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);