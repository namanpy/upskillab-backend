import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnrollmentLogicService } from './enrollment.logic';
import { EnrollmentDataService } from './enrollment.data';
import { EnrollmentController } from './enrollment.controller';
import { Enrollment, EnrollmentSchema } from '../../schemas/enrollment.schema';
import { OrderModule } from '../order/order.module'; // Import OrderModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]),
    OrderModule, // This makes OrderLogicService available
  ],
  controllers: [EnrollmentController],
  providers: [EnrollmentLogicService, EnrollmentDataService],
  exports: [EnrollmentLogicService],
})
export class EnrollmentModule {}