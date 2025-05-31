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

export interface GetAllOrdersParams {
  skip?: number;
  limit?: number;
  search?: string;
  sortByDate?: 'asc' | 'desc';
}

export interface OrderUser {
  _id: Types.ObjectId;
  email: string;
  username: string;
  mobileNumber: string;
}

export interface OrderStudent {
  _id: Types.ObjectId;
  fullName: string;
  college: string;
  studentType: string;
}

export interface OrderBatch {
  _id: Types.ObjectId;
  batchCode: string;
  startDate: Date;
}

export interface OrderResponse {
  _id: Types.ObjectId;
  totalAmount: number;
  amountPaid: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user?: OrderUser;
  student?: OrderStudent;
  batch?: OrderBatch;
  email?: string;
  mobileNumber: string;
  courseName?: string;
}

export interface GetAllOrdersResult {
  orders: OrderResponse[];
  total: number;
}

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

    return existingOrder.length ? existingOrder[0] : undefined;
  }

  async getAllOrders(params: GetAllOrdersParams): Promise<GetAllOrdersResult> {
    const { skip = 0, limit = 10, search, sortByDate = 'desc' } = params;

    const query = this.orderModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          from: 'students',
          localField: 'user._id',
          foreignField: 'user',
          as: 'student',
        },
      },
      {
        $unwind: {
          path: '$student',
          preserveNullAndEmptyArrays: true,
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
        $project: {
          _id: 1,
          totalAmount: 1,
          amountPaid: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          'user._id': 1,
          'user.email': 1,
          'user.username': 1,
          'user.mobileNumber': 1,
          'student._id': 1,
          'student.fullName': 1,
          'student.college': 1,
          'student.studentType': 1,
          'batch._id': 1,
          'batch.name': 1,
          'batch.startDate': 1,
          'batch.endDate': 1,
        },
      },
    ]);

    if (search) {
      query.append({
        $match: {
          $or: [
            { 'user.username': { $regex: search, $options: 'i' } },
            { 'student.fullName': { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    const countQuery = query.pipeline();
    const total = await this.orderModel.aggregate(countQuery).count('total');

    query
      .append({
        $sort: {
          createdAt: sortByDate === 'asc' ? 1 : -1,
        },
      })
      .append({
        $skip: skip,
      })
      .append({
        $limit: limit,
      });

    const orders = await query.exec();

    return {
      orders,
      total: total[0]?.total || 0,
    };
  }
}
