import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackLogicService } from './feedback.logic';
import { FeedbackDataService } from './feedback.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Feedback, FeedbackSchema } from '../../schemas/feedback.schema';
import { ClassSessionModule } from '../scheduler/class-session.module';
import { TeacherModule } from '../teachers/teacher.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
    ]),
    ClassSessionModule,
    TeacherModule,
    EnrollmentModule,
  ],
  providers: [FeedbackDataService, FeedbackLogicService],
  controllers: [FeedbackController],
})
export class FeedbackModule {}