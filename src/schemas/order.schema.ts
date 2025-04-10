import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import { Batch } from './course/batch.schema';
import { ORDER_STATUS } from 'src/common/constants/order.constants';
import { MongooseDocument } from './common.schema';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order extends MongooseDocument {
  @ApiProperty({
    description: 'Reference to the user who placed the order',
    type: String,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @ApiProperty({
    description: 'Course amount',
    type: Number,
  })
  @Prop({ required: true })
  totalAmount: number;

  @ApiProperty({
    description: 'Amount paid by user',
    type: Number,
  })
  @Prop({ required: true })
  amountPaid: number;

  @ApiProperty({
    description: 'Order status',
    type: String,
  })
  @Prop({ required: true, type: String, enum: Object.keys(ORDER_STATUS) })
  status: string;

  @ApiProperty({
    description: 'Reference to the batch',
    type: String,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true })
  batch: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
