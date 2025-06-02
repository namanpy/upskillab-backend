import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentStatusController } from './payment-status.controller';
import { PaymentStatusLogicService } from './payment.status.logic';
import { PaymentStatusDataService } from './payment.status.data';
import { Payment, PaymentSchema } from '../../schemas/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
  ],
  controllers: [PaymentStatusController],
  providers: [PaymentStatusLogicService, PaymentStatusDataService],
})
export class PaymentStatusModule {}