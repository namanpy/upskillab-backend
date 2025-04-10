import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';
import { BatchModule } from '../batch/batch.module';
import { UsersModule } from '../user/users.module';
import { RegistrationController } from './registration.controller';
import { RegistrationLogicService } from './registration.logic';
import { PaymentModule } from '../payment/payment.module';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    UsersModule,
    OrderModule,
    BatchModule,
    PaymentModule,
    StudentModule,
  ],
  controllers: [RegistrationController],
  providers: [RegistrationLogicService],
})
export class RegistrationModule {}
