import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentDataService } from './payment.data';
import { OrderDataService } from '../order/order.data';
import { ORDER_STATUS } from 'src/common/constants/order.constants';
import { PAYMENT_STATUS } from 'src/common/constants/payment.constants';

@ApiTags('payments')
@Controller('payment')
export class PaymentController {
  constructor(
    private paymentDataService: PaymentDataService,
    private orderDataService: OrderDataService,
  ) {}

  @Post('cashfree/callback')
  async handleCashfreeWebhook(
    @Body()
    webhookData: {
      data: {
        order: {
          order_id: string;
          order_amount: number;
          order_currency: string;
          order_tags: null;
        };
      };
    },
  ) {}
}
