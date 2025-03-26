import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseLogicService } from './course.logic';
import { CourseDataService } from './course.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from 'src/schemas/course/course.schema';
import { BatchDataService } from '../batch/batch.data';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    BatchDataService,
  ],
  providers: [CourseDataService, CourseLogicService],
  controllers: [CourseController],
  exports: [CourseDataService],
})
export class CourseModule {}
