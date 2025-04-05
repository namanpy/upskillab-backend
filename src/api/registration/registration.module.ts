import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';
import { BatchModule } from '../batch/batch.module';
import { CashfreeService } from '../payment/cashfree.logic';
import { UsersModule } from '../user/users.module';
import { RegistrationController } from './registration.controller';
import { RegistrationLogicService } from './registration.logic';

@Module({
  imports: [UsersModule, OrderModule, BatchModule],
  controllers: [RegistrationController],
  providers: [RegistrationLogicService, CashfreeService],
})
export class RegistrationModule {}
