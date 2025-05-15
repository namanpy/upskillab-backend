import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import mongoose, { Types, Document } from 'mongoose';
import { Course } from './course/course.schema';
import { Batch } from './course/batch.schema';

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true })
export class Coupon {
  @ApiProperty()
  @Prop({ required: false, unique: true })
  code: string;

  @ApiPropertyOptional({ type: Number, description: 'Discount percentage (0-100)' })
  @Prop({ required: false })
  discountPercent: number;

  @ApiPropertyOptional({ type: Number, description: 'Maximum discount amount' })
  @Prop()
  maxDiscountAmount?: number;

  @ApiPropertyOptional({ type: String, description: 'Reference to Course' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Course.name, required: false })
  course?: Types.ObjectId;

  @ApiPropertyOptional({ type: String, description: 'Reference to Batch' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Batch.name, required: false })
  batch?: Types.ObjectId;

  @ApiPropertyOptional({ type: Date })
  @Prop()
  validFrom?: Date;

  @ApiPropertyOptional({ type: Date })
  @Prop()
  validTo?: Date;

  @ApiPropertyOptional({ type: Boolean })
  @Prop({ default: true })
  active: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);