/**
 * Reference - https://docs.nestjs.com/techniques/mongodb
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Topic } from './topic.schema';

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
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  chapterNumber: number;

  @ApiProperty()
  @Prop({ required: true })
  week: number;

  @ApiProperty()
  @Prop({ required: true })
  session: number;

  @ApiProperty()
  @Prop({ default: true })
  active: boolean;

  @ApiProperty({ type: String })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  course: Types.ObjectId;
}
export const ChapterSchema = SchemaFactory.createForClass(Chapter);
