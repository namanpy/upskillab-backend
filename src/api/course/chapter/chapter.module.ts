import { Module } from '@nestjs/common';
import { ChapterDataService } from './chapter.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from '../../../schemas/course/chapter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
  ],
  providers: [ChapterDataService],
  controllers: [],
  exports: [ChapterDataService],
})
export class ChapterModule {}
