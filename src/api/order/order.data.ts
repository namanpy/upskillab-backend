import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../../schemas/order.schema';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';
import { User } from 'src/schemas/user.schema';
import { Batch } from 'src/schemas/course/batch.schema';
import { MongooseDocument } from 'src/schemas/common.schema';
import { Types } from 'mongoose';

@Injectable()
export class OrderDataService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async createOrder(createOrderDto: Omit<Order, keyof MongooseDocument>) {
    const newOrder = new this.orderModel(createOrderDto);
    return newOrder.save().then((d) => d.toObject({}));
  }

  async getOrderById(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate<{
        user: User | (undefined extends Order['user'] ? undefined : never);
        batch: Batch | (undefined extends Order['batch'] ? undefined : never);
      }>([
        {
          path: 'user',
        },
        {
          path: 'batch',
        },
      ])
      .lean()
      .exec();

    if (!order) throw new CustomError(ERROR.ORDER_NOT_FOUND);
    return order;
  }

  async updateOrder(id: string, updateOrderDto: Partial<Order>) {
    const order = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .populate('user')
      .populate('batch')
      .lean()
      .exec();

    if (!order) throw new CustomError(ERROR.ORDER_NOT_FOUND);
    return order;
  }

  async deleteOrder(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id).lean().exec();

    if (!order) throw new CustomError(ERROR.ORDER_NOT_FOUND);
    return order;
  }

  async getOrdersByUser(userId: string) {
    return this.orderModel
      .find({ user: userId })
      .populate<{
        batch: Batch | (undefined extends Order['batch'] ? undefined : never);
      }>('batch')
      .lean()
      .exec();
  }

  async checkExistingOrder(userId: Types.ObjectId, courseId: Types.ObjectId) {
    const existingOrder = await this.orderModel
      .aggregate([
        {
          $match: {
            user: userId,
          },
        },
        {
          $lookup: {
            from: 'batches',
            localField: 'batch',
            foreignField: '_id',
            as: 'batch',
          },
        },
        {
          $unwind: '$batch',
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'batch.course',
            foreignField: '_id',
            as: 'course',
          },
        },
        {
          $unwind: '$course',
        },
        {
          $match: {
            'course._id': courseId,
          },
        },
      ])
      .exec();

    return existingOrder.length > 0;
  }
}
