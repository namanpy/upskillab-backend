import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from '../../schemas/payment.schema'; // Use existing schema

@Injectable()
export class PaymentStatusDataService {
  constructor(
    @InjectModel('Payment') private paymentModel: Model<Payment>,
  ) {}

  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    return await this.paymentModel
      .find()
      .populate({
        path: 'order',
        match: { user: userId },
        populate: [
          { path: 'user' },
          {
            path: 'batch',
            populate: { path: 'course' },
          },
        ],
      })
      .exec();
  }

  async getAllPayments(): Promise<Payment[]> {
    return await this.paymentModel
      .find()
      .populate({
        path: 'order',
        populate: [
          { path: 'user' },
          {
            path: 'batch',
            populate: { path: 'course' },
          },
        ],
      })
      .exec();
  }
}