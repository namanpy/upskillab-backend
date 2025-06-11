import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackLogicService } from './feedback.logic';
import { FeedbackDataService } from './feedback.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Feedback, FeedbackSchema } from '../../schemas/feedback.schema';
import { ClassSessionModule } from '../scheduler/class-session.module';
import { TeacherModule } from '../teachers/teacher.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { StudentModule } from '../student/student.module';
import { Student, StudentSchema } from 'src/schemas/student.schema';
import { Batch, BatchSchema } from '../../schemas/course/batch.schema';
import { Course, CourseSchema } from '../../schemas/course/course.schema';
import { BatchModule } from '../batch/batch.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Batch.name, schema: BatchSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
    ClassSessionModule,
    TeacherModule,
    EnrollmentModule,
    StudentModule,
BatchModule,
  ],
  providers: [FeedbackDataService, FeedbackLogicService],
  controllers: [FeedbackController],
})
export class FeedbackModule {}