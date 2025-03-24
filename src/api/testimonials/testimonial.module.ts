import { Module } from '@nestjs/common';
import { TestimonialController } from './testimonial.controller';
import { TestimonialLogicService } from './testimonial.logic';
import { TestimonialDataService } from './testimonial.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Testimonial, TestimonialSchema } from './testimonial.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Testimonial.name, schema: TestimonialSchema },
    ]),
  ],
  providers: [TestimonialDataService, TestimonialLogicService],
  controllers: [TestimonialController],
  exports: [TestimonialDataService],
})
export class TestimonialModule {}
