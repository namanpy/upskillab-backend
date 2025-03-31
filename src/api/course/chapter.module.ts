import { Module } from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { ChapterLogicService } from './chapter.logic';
import { ChapterDataService } from './chapter.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from '../../schemas/course/chapter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
  ],
  providers: [ChapterDataService, ChapterLogicService],
  controllers: [ChapterController],
  exports: [ChapterDataService],
})
export class ChapterModule {}