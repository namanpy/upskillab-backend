

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from '../../schemas/order.schema';
import { UserSchema } from '../../schemas/user.schema';
import { StudentSchema } from '../../schemas/student.schema';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentLogicService } from './enrollment.logic';
import { EnrollmentDataService } from './enrollment.data';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Student', schema: StudentSchema },
    ]),
  ],
  controllers: [EnrollmentController],
  providers: [EnrollmentLogicService, EnrollmentDataService],
  exports: [EnrollmentDataService],
})
export class EnrollmentModule {}