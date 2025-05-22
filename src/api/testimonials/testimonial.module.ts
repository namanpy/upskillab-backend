import { Module } from '@nestjs/common';
import { TestimonialController } from './testimonial.controller';
import { TestimonialLogicService } from './testimonial.logic';
import { TestimonialDataService } from './testimonial.data';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationModule } from '../notification/notification.module';
import {
  Testimonial,
  TestimonialSchema,
} from '../../schemas/home/testimonial.schema';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Testimonial.name, schema: TestimonialSchema },
    ]),
    NotificationModule,
    StudentModule,
  ],
  providers: [TestimonialDataService, TestimonialLogicService],
  controllers: [TestimonialController],
  exports: [TestimonialDataService],
})
export class TestimonialModule {}
