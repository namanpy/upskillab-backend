import { Injectable } from '@nestjs/common';
import { OrderDataService } from './order.data';
import {
  CreateOrderRequestDto,
  UpdateOrderRequestDto,
} from '../../dto/order.dto';
import { Types } from 'mongoose';

@Injectable()
export class OrderLogicService {
  constructor(private orderDataService: OrderDataService) {}

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
    };
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderRequestDto) {
    await this.orderDataService.updateOrder(id, updateOrderDto);
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
      user: order.user._id.toString(),
      batch: order.batch._id.toString(),
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
        user: {
          ...order.user,
          _id: order.user._id.toString(),
        },
        batch: {
          ...order.batch,
          _id: order.batch._id.toString(),
        },
        student: {
          ...order.student,
          _id: order.student._id.toString(),
        },
      })),
      total,
    };
  }
}
