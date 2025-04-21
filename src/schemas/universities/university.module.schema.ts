import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { UniversityChapter, UniversityChapterSchema } from './university.chapter.schema'; // Import Chapter schema

export type ModuleDocument = HydratedDocument<UniversityModule>;

@Schema()
export class UniversityModule {
  @ApiProperty()
  @Prop({ required: true })
  moduleName: string;

  @ApiProperty()
  @Prop({ type: [UniversityChapterSchema], default: [] }) // Array of chapters
  chapters: UniversityChapter[];
}

export const UniversityModuleSchema = SchemaFactory.createForClass(UniversityModule);