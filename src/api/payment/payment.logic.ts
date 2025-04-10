import { Injectable } from '@nestjs/common';
import { PaymentDataService } from './payment.data';
import { OrderDataService } from '../order/order.data';
import { CashfreeService } from './cashfree.logic';
import { ORDER_STATUS } from 'src/common/constants/order.constants';
import {
  CASHFREE_PAYMENT_STATUS,
  PAYMENT_STATUS,
} from 'src/common/constants/payment.constants';
import { BatchDataService } from '../batch/batch.data';
import { SendGridService } from 'src/common/services/sendgrid.service';

@Injectable()
export class PaymentLogicService {
  constructor(
    private batchDataService: BatchDataService,
    private orderDataService: OrderDataService,
    private cashfreeService: CashfreeService,
    private sendGridService: SendGridService,
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
        cf_payment_id: string;
        payment_status: string;
        payment_message: string;
      };
    };
  }) {
    const { order_id } = webhookData.data.order;
    const { cf_payment_id } = webhookData.data.payment;

    const payment = await this.cashfreeService.fetchPaymentStatus(
      order_id,
      cf_payment_id,
    );

    const { status } = payment;

    const order = await this.orderDataService.getOrderById(
      payment.order._id.toString(),
    );

    const batch = await this.batchDataService.getBatchById(
      order.batch._id.toString(),
    );

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
    await this.orderDataService.updateOrder(payment.order._id.toString(), {
      status: orderStatus,
      amountPaid: payment.amount,
    });

    await this.sendGridService.sendPaymentConfirmation({
      to: payment.user.email,
      name: payment.user.username,
      courseName: batch?.course.courseName || 'Unknown',
      amount: payment.amount,
      orderId: order._id.toString(),
    });

    return { success: true, message: 'Webhook processed successfully' };
  }
}
