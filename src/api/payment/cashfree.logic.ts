import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import { PaymentDataService } from './payment.data';
import { Types } from 'mongoose';
import {
  CASHFREE_PAYMENT_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from 'src/common/constants/payment.constants';

@Injectable()
export class CashfreeService {
  private readonly cashfree: Cashfree;
  private readonly returnUrl: string | undefined;
  private readonly notifyUrl: string;

  constructor(
    private configService: ConfigService,
    private paymentDataService: PaymentDataService,
  ) {
    const apiKey = this.configService.get<string>('CASHFREE_API_KEY');
    const apiSecret = this.configService.get<string>('CASHFREE_API_SECRET');

    this.returnUrl = this.configService.get<string>('CASHFREE_RETURN_URL');
    const notifyUrl = this.configService.get<string>('CASHFREE_NOTIFY_URL');

    if (!notifyUrl) throw new Error('CASHFREE_NOTIFY_URL is not defined');

    this.notifyUrl = notifyUrl;

    this.cashfree = new Cashfree(CFEnvironment.SANDBOX, apiKey, apiSecret);
  }

  async createPayment(data: {
    orderId: Types.ObjectId;
    userId: Types.ObjectId;
    amount: number;
    customerDetails: {
      customerId: string;
      customerEmail?: string;
      customerPhone: string;
      customerName?: string;
    };
  }) {
    const { orderId, userId, amount, customerDetails } = data;

    try {
      const response = await this.cashfree.PGCreateOrder({
        order_amount: 1,
        order_currency: 'INR',
        order_id: 'order_34692745',
        order_meta: {
          return_url: this.returnUrl,
          notify_url: this.notifyUrl,
        },
        customer_details: {
          customer_id: customerDetails.customerId,
          customer_email: customerDetails.customerEmail,
          customer_phone: customerDetails.customerPhone,
          customer_name: customerDetails.customerName,
        },
      });

      const paymentData = response.data;

      // Create payment
      const payment = await this.paymentDataService.createPayment({
        order: orderId,
        user: userId,
        amount,
        paymentMethod: PAYMENT_METHOD.CASHFREE.code,
        status: PAYMENT_STATUS.PENDING.code,
        transactionId: paymentData.order_id!,
      });

      return {
        paymentSessionId: paymentData.payment_session_id,
        payment,
      };
    } catch (error) {
      throw new Error('Failed to create payment link');
    }
  }

  async fetchOrderStatus(orderId: string) {
    try {
      const response = await this.cashfree.PGFetchOrder(orderId);

      const orderData = response.data;

      // Get payment by transaction ID
      const payment =
        await this.paymentDataService.getPaymentByTransactionId(orderId);

      if (!payment) throw new Error('Payment not found');

      // Map Cashfree status to internal payment status
      let paymentStatus;
      switch (orderData.order_status) {
        case CASHFREE_PAYMENT_STATUS.SUCCESS.code:
          paymentStatus = PAYMENT_STATUS.COMPLETED.code;
          break;
        case CASHFREE_PAYMENT_STATUS.FAILED.code:
          paymentStatus = PAYMENT_STATUS.FAILED.code;
          break;
        case CASHFREE_PAYMENT_STATUS.PENDING.code:
          paymentStatus = PAYMENT_STATUS.PENDING.code;
          break;
        default:
          paymentStatus = PAYMENT_STATUS.CANCELLED.code;
      }

      // Update payment status
      const updatedPayment = await this.paymentDataService.updatePaymentStatus(
        payment._id,
        paymentStatus,
      );

      return updatedPayment;
    } catch (error) {
      throw new Error('Failed to fetch order status');
    }
  }
}
