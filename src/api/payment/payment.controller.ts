import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentLogicService } from './payment.logic';

@ApiTags('payments')
@Controller('payment')
export class PaymentController {
  constructor(private paymentLogicService: PaymentLogicService) {}

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
        payment: {
          payment_status: string;
          payment_message: string;
        };
      };
    },
  ) {
    try {
      return await this.paymentLogicService.handleCashfreeWebhook(webhookData);
    } catch (error) {
      console.error('Webhook processing error:', error);
      return { success: false, message: 'Failed to process webhook' };
    }
  }
}
