import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../../schemas/order.schema';
import { OrderController } from './order.controller';
import { OrderLogicService } from './order.logic';
import { OrderDataService } from './order.data';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderLogicService, OrderDataService],
  exports: [OrderDataService],
})
export class OrderModule {}
