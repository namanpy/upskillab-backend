import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryLogicService } from './category.logic';
import { CategoryDataService } from './category.data';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Testimonial,
  TestimonialSchema,
} from '../../schemas/testimonial.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Testimonial.name, schema: TestimonialSchema },
    ]),
  ],
  providers: [CategoryDataService, CategoryLogicService],
  controllers: [CategoryController],
  exports: [CategoryDataService],
})
export class CategoryModule {}
