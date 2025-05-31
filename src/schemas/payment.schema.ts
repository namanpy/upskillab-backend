import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from 'src/common/constants/payment.constants';
import { MongooseDocument } from './common.schema';

@Schema({ timestamps: true })
export class Payment extends MongooseDocument {
  @ApiProperty({ description: 'The ID of the associated order' })
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  order: Types.ObjectId;

  @ApiProperty({
    description: 'The payment method used',
  })
  @Prop({ required: true, enum: Object.keys(PAYMENT_METHOD) })
  paymentMethod: string;

  @Prop({ required: false })
  paymentMode?: string;

  @Prop({ required: false })
  cashFreePaymentId?: string;

  @ApiProperty({
    description: 'The unique transaction ID',
  })
  @Prop({ required: true })
  transactionId: string;

  @ApiProperty({ description: 'The payment amount', example: 99.99 })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({
    description: 'The payment status',
    enum: Object.keys(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING.code,
  })
  @Prop({ required: true, default: 'PENDING' })
  status: string;

  @ApiProperty({ description: 'The ID of the user who made the payment' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
