import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Batch } from 'src/schemas/course/batch.schema';
import { Course } from 'src/schemas/course/course.schema';

export class CouponDto {
  @ApiProperty() _id: string | Types.ObjectId;
  @ApiProperty() code: string;
  @ApiProperty() discountPercent: number;
  @ApiProperty({ required: false }) maxDiscountAmount?: number;
  @ApiProperty({ required: false }) course?: Course;
  @ApiProperty({ required: false }) batch?: Batch;
  @ApiProperty({ required: false }) validFrom?: Date;
  @ApiProperty({ required: false }) validTo?: Date;
  @ApiProperty({ required: false }) active?: boolean;
}

export class PaginatedCouponsResponseDto {
  @ApiProperty({ type: [CouponDto] })
  coupons: CouponDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;
}
