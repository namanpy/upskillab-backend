import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { OrderLogicService } from './order.logic';
import {
  CreateOrderRequestDto,
  CreateOrderResponseDto,
  UpdateOrderRequestDto,
  UpdateOrderResponseDto,
  GetOrderResponseDto,
} from '../../dto/order.dto';
import { ERROR } from 'src/common/constants/error.constants';
import { Query } from '@nestjs/common';
import { GetOrdersQueryDto, GetOrdersResponseDto } from '../../dto/order.dto';
import { AuthGuard } from '@nestjs/passport';
import { AllowUserType, UserGuard } from 'src/common/guard/user.guard';
import { USER_TYPES } from 'src/common/constants/user.constants';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private orderLogicService: OrderLogicService) {}

  @Post()
  @ApiResponse({
    status: 200,
    type: CreateOrderResponseDto,
  })
  async createOrder(
    @Body() createOrderDto: CreateOrderRequestDto,
  ): Promise<CreateOrderResponseDto> {
    return await this.orderLogicService.createOrder(createOrderDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: GetOrderResponseDto,
  })
  @ApiResponse({
    status: ERROR.ORDER_NOT_FOUND.code,
    description: ERROR.ORDER_NOT_FOUND.message,
  })
  async getOrderById(@Param('id') id: string): Promise<GetOrderResponseDto> {
    return await this.orderLogicService.getOrderById(id);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    type: UpdateOrderResponseDto,
  })
  @ApiResponse({
    status: ERROR.ORDER_NOT_FOUND.code,
    description: ERROR.ORDER_NOT_FOUND.message,
  })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderRequestDto,
  ): Promise<UpdateOrderResponseDto> {
    return await this.orderLogicService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Order deleted successfully',
  })
  @ApiResponse({
    status: ERROR.ORDER_NOT_FOUND.code,
    description: ERROR.ORDER_NOT_FOUND.message,
  })
  async deleteOrder(@Param('id') id: string) {
    return await this.orderLogicService.deleteOrder(id);
  }

  @Get('user/:userId')
  @ApiResponse({
    status: 200,
    type: [GetOrderResponseDto],
  })
  async getOrdersByUser(@Param('userId') userId: string) {
    return await this.orderLogicService.getOrdersByUser(userId);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: GetOrdersResponseDto,
  })
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @AllowUserType(USER_TYPES.ADMIN)
  async getAllOrders(
    @Query() query: GetOrdersQueryDto,
  ): Promise<GetOrdersResponseDto> {
    return await this.orderLogicService.getAllOrders({
      skip: Number(query.skip),
      limit: Number(query.limit),
      search: query.search,
      sortByDate: query.sortByDate,
    });
  }
}
