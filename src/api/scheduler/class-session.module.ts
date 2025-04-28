
import { Module } from '@nestjs/common';
import { ClassSessionController } from './class-session.controller';
import { ClassSessionLogicService } from './class-session.logic';
import { ClassSessionDataService } from './class-session.data';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassSession, ClassSessionSchema } from '../../schemas/class-session.schema';
import { BatchModule } from '../batch/batch.module';
import { CourseModule } from '../course/course.module';
import { TeacherModule } from '../teachers/teacher.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClassSession.name, schema: ClassSessionSchema }
    ]),
    BatchModule,
    CourseModule,
    TeacherModule,
  ],
  providers: [
    ClassSessionDataService,
    ClassSessionLogicService,
    // BatchDataService,
    // CourseDataService,
    // TeacherDataService,
  ],
  controllers: [ClassSessionController],
  exports: [ClassSessionDataService],
})
export class ClassSessionModule {}