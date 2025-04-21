import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type ChapterDocument = HydratedDocument<UniversityChapter>;

@Schema()
export class UniversityChapter {
  @ApiProperty()
  @Prop({ required: true })
  chapterName: string;

  @ApiProperty()
  @Prop({ required: true })
  content: string; // Can be text, link, or anything you want
}

export const UniversityChapterSchema = SchemaFactory.createForClass(UniversityChapter);