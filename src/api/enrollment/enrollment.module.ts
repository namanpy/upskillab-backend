// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { EnrollmentLogicService } from './enrollment.logic';
// import { EnrollmentDataService } from './enrollment.data';
// import { EnrollmentController } from './enrollment.controller';
// import { Enrollment, EnrollmentSchema } from '../../schemas/enrollment.schema';
// import { OrderModule } from '../order/order.module'; // Import OrderModule

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]),
//     OrderModule, // This makes OrderLogicService available
//   ],
//   controllers: [EnrollmentController],
//   providers: [EnrollmentLogicService, EnrollmentDataService],
//   exports: [EnrollmentLogicService],
// })
// export class EnrollmentModule {}


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