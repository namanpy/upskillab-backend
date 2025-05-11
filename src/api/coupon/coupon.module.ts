import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from 'src/schemas/coupon.schema';
import { CouponDataService } from './coupon.data';
import { CouponLogicService } from './coupon.logic';
import { CouponController } from './coupon.controller';
import { BatchDataService } from '../batch/batch.data';
import { CourseDataService } from '../course/course.data';
import { BatchModule } from '../batch/batch.module';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
    BatchModule,
    CourseModule,
  ],
  providers: [
    CouponDataService,
    CouponLogicService,
    BatchDataService,
    CourseDataService,
  ],
  controllers: [CouponController],
  exports: [CouponLogicService, CouponDataService],
})
export class CouponModule {}
