import { Module, forwardRef } from '@nestjs/common';
import { UniversityCourseController } from './university-course.controller';
import { UniversityCourseLogicService } from './university-course.logic';
import { UniversityCourseDataService } from './university-course.data';
import { MongooseModule } from '@nestjs/mongoose';
import { UniversityCourse, UniversityCourseSchema } from '../../../schemas/universities/university-course.schema';
import { UniversityModule, UniversityModuleSchema } from '../../../schemas/universities/university.module.schema';
import { UniversityChapter, UniversityChapterSchema } from '../../../schemas/universities/university.chapter.schema';
import { University2Module } from '../../universities/university2/university2.module'; // Corrected path

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UniversityCourse.name, schema: UniversityCourseSchema },
      { name: UniversityModule.name, schema: UniversityModuleSchema },
      { name: UniversityChapter.name, schema: UniversityChapterSchema },
    ]),
    forwardRef(() => University2Module),
  ],
  controllers: [UniversityCourseController],
  providers: [UniversityCourseLogicService, UniversityCourseDataService],
  exports: [UniversityCourseLogicService],
})
export class UniversityCourseModule {}