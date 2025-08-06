import { Injectable } from '@nestjs/common';
import { OrderDataService } from './order.data';
import {
  CreateOrderRequestDto,
  GetOrderResponseDto,
  UpdateOrderRequestDto,
} from '../../dto/order.dto';
import { Types } from 'mongoose';

@Injectable()
export class OrderLogicService {
  constructor(private orderDataService: OrderDataService) { }

  async createOrder(createOrderDto: CreateOrderRequestDto) {
    await this.orderDataService.createOrder({
      ...createOrderDto,
      user: Types.ObjectId.createFromHexString(createOrderDto.user),
      batch: Types.ObjectId.createFromHexString(createOrderDto.batch),
    });
    return { isSuccess: true };
  }

  async getOrderById(id: string) {
    const order = await this.orderDataService.getOrderById(id);
    return {
      ...order,
      _id: order._id.toString(),
      user: order.user,
      batch: order.batch,
      serialNumber:
        order.status === 'COMPLETED' ? order.serialNumber : undefined,
    };
  }

async getOrderByBatchId(batchId: string): Promise<GetOrderResponseDto[]> {
  const orders = await this.orderDataService.getOrderByBatchId(batchId);

  return orders
  .filter(order=>order.user?.isActive==true)
  .map(order => ({
    _id: order._id.toString(),
    user: order.user,
    batch: order.batch,
    serialNumber: order.status === 'COMPLETED' ? order.serialNumber : undefined,
    totalAmount: order.totalAmount,
    amountPaid: order.amountPaid,
    status: order.status,
    name: order.name,
    email: order.email,
    mobileNumber: order.mobileNumber,
    courseName: order.courseName,
  }));
}

  async updateOrder(id: string, updateOrderDto: UpdateOrderRequestDto) {
    const updatedOrder = {
  ...updateOrderDto,
  batch: updateOrderDto.batch ? new Types.ObjectId(updateOrderDto.batch) : undefined,
};
    await this.orderDataService.updateOrder(id, updatedOrder);
    return { isSuccess: true };
  }

  async deleteOrder(id: string) {
    await this.orderDataService.deleteOrder(id);
    return { message: 'Order deleted successfully' };
  }

  async getOrdersByUser(userId: string) {
    const orders = await this.orderDataService.getOrdersByUser(userId);
    return orders.map((order) => ({
      ...order,
      _id: order._id.toString(),
      user: order.user?._id.toString(),
      batch: order.batch?._id.toString(),
      serialNumber:
        order.status === 'COMPLETED' ? order.serialNumber : undefined,
    }));
  }

  async getAllOrders(params: {
    skip?: number;
    limit?: number;
    search?: string;
    sortByDate?: 'asc' | 'desc';
  }) {
    const { orders, total } = await this.orderDataService.getAllOrders(params);
    return {
      orders: orders.map((order) => ({
        ...order,
        _id: order._id.toString(),

        user: order.user
          ? {
            ...order.user,
            _id: order.user._id,
          }
          : undefined,

        batch: order.batch
          ? {
            ...order.batch,
            _id: order.batch._id.toString(),
          }
          : undefined,
        ...(order.student
          ? {
            student: {
              ...order.student,
              _id: order.student._id.toString(),
            },
          }
          : { student: undefined }),
        serialNumber:
          order.status === 'COMPLETED' ? order.serialNumber : undefined,
      })),
      total,
    };
  }

  async getManualOrdersOnly(params: {
    skip?: number;
    limit?: number;
    search?: string;
    sortByDate?: 'asc' | 'desc';
  }) {
    const { orders, total } = await this.orderDataService.getManualOrdersOnly(params);
    console.log(orders,"1")
    return {
      orders: orders.map((order: any) => ({ // ✅ Added 'any' type
        _id: order._id.toString(),
        user: order.user
          ? {
            ...order.user,
            _id: order.user._id,
          }
          : undefined,
          batch: order.batch
          ? {
            ...order.batch,
            _id: order.batch._id.toString(),
          }
          : undefined,
        name: order.name, // ✅ Now this will work
        email: order.email || '', 
        mobileNumber: order.mobileNumber,
        totalAmount: order.totalAmount,
        amountPaid: order.amountPaid,
        status: order.status,
        source:order.source,
        mode:order.mode,
        serialNumber: order.serialNumber || '', // ✅ Handle undefined
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
      total,
    };
  }
}