import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseLogicService } from './course.logic';
import { CourseDataService } from './course.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from 'src/schemas/course/course.schema';
import { BatchModule } from '../batch/batch.module';
import { ChapterModule } from './chapter/chapter.module'; // Add this import
import { TopicModule } from './topic/topic.module';
import { CategoryModule } from '../category/category.module';
import { LanguageModule } from '../language/language.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    BatchModule,
    ChapterModule,
    TopicModule,
    CategoryModule,
    LanguageModule,
  ],
  providers: [CourseDataService, CourseLogicService],
  controllers: [CourseController],
  exports: [CourseDataService],
})
export class CourseModule {}
