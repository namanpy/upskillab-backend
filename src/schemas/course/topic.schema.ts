import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Chapter } from './chapter.schema';

export type TopicDocument = Topic & Document;

@Schema()
export class Topic {
  @ApiProperty({
    description: 'The name of the topic',
    example: 'JavaScript Basics',
  })
  @Prop({ required: true })
  topicName: string;

  @ApiProperty({
    description: 'Reference to the chapter this topic belongs to',
    example: 'chapter_id_here',
  })
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Chapter.name,
  })
  chapter: Types.ObjectId;

  @ApiProperty({
    description: 'Whether the topic is active',
    example: true,
    default: true,
  })
  @Prop({ default: true })
  active: boolean;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
