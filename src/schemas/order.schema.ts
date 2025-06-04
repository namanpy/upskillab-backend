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
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  user?: Types.ObjectId;

  @ApiProperty({
    type: String,
  })
  @Prop({ type: String, required: false })
  courseName?: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ type: String, required: false })
  name?: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ type: String, required: false })
  email?: string;

  @ApiProperty({
    description: 'Mobile number of the user',
    type: String,
  })
  @Prop({ required: false })
  mobileNumber?: string;

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
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: false })
  batch?: Types.ObjectId;

  @ApiProperty({
    description: 'Reference to the coupon used',
    type: String,
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: false,
  })
  coupon?: Types.ObjectId;

  @ApiProperty({
    description: '6 digit serial number of the order',
    type: String,
  })
  @Prop({ required: false, unique: true })
  serialNumber?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre('save', async function (next) {
  if (!this.serialNumber) {
    const lastOrder = await (this.constructor as any)
      .findOne({})
      .sort({ createdAt: -1 })
      .select('serialNumber')
      .exec();

    let lastSerial = 0;
    if (lastOrder?.serialNumber) {
      lastSerial = parseInt(lastOrder.serialNumber);
    }

    const newSerial = (lastSerial + 1).toString().padStart(6, '0');
    this.serialNumber = newSerial;
  }
  next();
});
