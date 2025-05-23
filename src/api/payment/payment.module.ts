import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from '../../schemas/payment.schema';
import { PaymentDataService } from './payment.data';
import { OrderModule } from '../order/order.module';
import { PaymentController } from './payment.controller';
import { CashfreeService } from './cashfree.logic';
import { PaymentLogicService } from './payment.logic';
import { ConfigModule } from '@nestjs/config';
import { BatchModule } from '../batch/batch.module';
import { SendGridModule } from 'src/common/services/sendgrid.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    OrderModule,
    ConfigModule,
    BatchModule,
    SendGridModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentDataService, CashfreeService, PaymentLogicService],
  exports: [PaymentDataService, CashfreeService],
})
export class PaymentModule {}
