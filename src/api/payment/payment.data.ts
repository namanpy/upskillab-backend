import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment } from '../../schemas/payment.schema';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';
import { Order } from 'src/schemas/order.schema';
import { User } from 'src/schemas/user.schema';
import { MongooseDocument } from 'src/schemas/common.schema';

@Injectable()
export class PaymentDataService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) {}

  async createPayment(createPaymentDto: Omit<Payment, keyof MongooseDocument>) {
    const payment = new this.paymentModel({
      ...createPaymentDto,
      order: Types.ObjectId.createFromHexString(
        createPaymentDto.order.toString(),
      ),
      user: Types.ObjectId.createFromHexString(
        createPaymentDto.user.toString(),
      ),
    });
    return payment.save().then((d) => d.toObject({}));
  }

  async getPaymentByOrderId(orderId: string) {
    const payment = await this.paymentModel
      .findOne({ order: Types.ObjectId.createFromHexString(orderId) })
      .populate<{
        order: Order | (undefined extends Payment['order'] ? undefined : never);
        user: User | (undefined extends Payment['user'] ? undefined : never);
      }>([{ path: 'order' }, { path: 'user' }])
      .lean()
      .exec();

    if (!payment) throw new CustomError(ERROR.PAYMENT_NOT_FOUND);
    return payment;
  }

  async updatePayment(
    paymentId: Types.ObjectId,
    data: {
      status: string;
      paymentMethod?: string;
      cashfreePaymentId?: string;
    },
  ) {
    const payment = await this.paymentModel
      .findByIdAndUpdate(paymentId, data, { new: true })
      .populate<{
        order: Order | (undefined extends Payment['order'] ? undefined : never);
        user: User | (undefined extends Payment['user'] ? undefined : never);
      }>([{ path: 'order' }, { path: 'user' }])
      .lean()
      .exec();

    if (!payment) throw new CustomError(ERROR.PAYMENT_NOT_FOUND);
    return payment;
  }

  async getPaymentByTransactionId(transactionId: string) {
    const payment = await this.paymentModel
      .findOne({ transactionId })
      .populate<{
        order: Order | (undefined extends Payment['order'] ? undefined : never);
        user: User | (undefined extends Payment['user'] ? undefined : never);
      }>([{ path: 'order' }, { path: 'user' }])
      .lean()
      .exec();

    if (!payment) throw new CustomError(ERROR.PAYMENT_NOT_FOUND);
    return payment;
  }

  async getPaymentsByUser(userId: string) {
    return this.paymentModel
      .find({ userId: Types.ObjectId.createFromHexString(userId) })
      .populate<{
        order: Order | (undefined extends Payment['order'] ? undefined : never);
      }>([{ path: 'order' }])
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }
}
