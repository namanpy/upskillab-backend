import { Injectable } from '@nestjs/common';
import { PaymentDataService } from './payment.data';
import { OrderDataService } from '../order/order.data';
import { CashfreeService } from './cashfree.logic';
import { ORDER_STATUS } from 'src/common/constants/order.constants';
import {
  CASHFREE_PAYMENT_STATUS,
  PAYMENT_STATUS,
} from 'src/common/constants/payment.constants';

@Injectable()
export class PaymentLogicService {
  constructor(
    private paymentDataService: PaymentDataService,
    private orderDataService: OrderDataService,
    private cashfreeService: CashfreeService,
  ) {}

  async handleCashfreeWebhook(webhookData: {
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
  }) {
    const { order_id } = webhookData.data.order;

    const payment = await this.cashfreeService.fetchOrderStatus(order_id);

    const { status } = payment;

    // Map Cashfree status to internal payment status
    let orderStatus: string;

    switch (status) {
      case PAYMENT_STATUS.COMPLETED.code:
        orderStatus = ORDER_STATUS.COMPLETED.code;
        break;
      case PAYMENT_STATUS.FAILED.code:
        orderStatus = ORDER_STATUS.FAILED.code;
        break;
      case PAYMENT_STATUS.CANCELLED.code:
        orderStatus = ORDER_STATUS.CANCELLED.code;
        break;
      default:
        orderStatus = ORDER_STATUS.PENDING.code;
    }

    // Update order status
    await this.orderDataService.updateOrder(payment.order.toString(), {
      status: orderStatus,
      amountPaid: payment.amount,
    });

    return { success: true, message: 'Webhook processed successfully' };
  }
}
