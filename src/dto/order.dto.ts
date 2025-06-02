import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { ORDER_STATUS } from 'src/common/constants/order.constants';
import { STUDENT_TYPE } from 'src/common/constants/student.constants';
import { Batch } from 'src/schemas/course/batch.schema';
import { User } from 'src/schemas/user.schema';

export class CreateOrderRequestDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  user: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Total amount of the order',
    example: 999.99,
  })
  totalAmount: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Amount paid by the user',
    example: 999.99,
  })
  amountPaid: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ORDER_STATUS)
  @ApiProperty({
    description: 'Order status',
    enum: Object.keys(ORDER_STATUS),
    example: 'PENDING',
  })
  status: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Batch ID',
    example: '507f1f77bcf86cd799439011',
  })
  batch: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Coupon ID',
    example: '507f1f77bcf86cd799439011',
  })
  couponCode: string;
}

export class CreateOrderResponseDto {
  @ApiProperty()
  isSuccess: boolean;
}

export class UpdateOrderRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(ORDER_STATUS)
  @ApiPropertyOptional({
    description: 'Order status',
    enum: Object.keys(ORDER_STATUS),
  })
  status?: string;

  @IsNumber()
  @ApiPropertyOptional({
    description: 'Amount paid by the user',
  })
  amountPaid?: number;
}

export class UpdateOrderResponseDto {
  @ApiProperty()
  isSuccess: boolean;
}

export class GetOrderResponseDto {
  @ApiProperty()
  _id: string;

  @ApiPropertyOptional({
    type: User,
  })
  user?: User;

  @ApiPropertyOptional({
    type: String,
  })
  name?: string;

  @ApiPropertyOptional({
    type: String,
  })
  email?: string;

  @ApiPropertyOptional({
    type: String,
  })
  courseName?: string;

  @ApiProperty({
    type: String,
  })
  mobileNumber?: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  amountPaid: number;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional({
    type: Batch,
  })
  batch?: Batch;

  @ApiProperty()
  serialNumber?: string;
}

export class GetOrdersQueryDto {
  @ApiPropertyOptional({
    description: 'Number of records to skip',
    example: 0,
  })
  @IsNumber()
  skip?: number = 0;

  @ApiPropertyOptional({
    description: 'Number of records to return',
    example: 10,
  })
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search in username and student name',
    example: 'john',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort by date (asc/desc)',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsString()
  sortByDate?: 'asc' | 'desc' = 'desc';
}

export class OrderUserDto {
  @ApiProperty({ type: String, description: 'User ID' })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiPropertyOptional({ description: 'Mobile number' })
  mobileNumber?: string;
}

export class OrderStudentDto {
  @ApiProperty({ description: 'Student ID' })
  _id: string;

  @ApiProperty({ description: 'Full name' })
  fullName: string;

  @ApiPropertyOptional({ description: 'College name' })
  college?: string;

  @ApiProperty({ description: 'Student type', enum: Object.keys(STUDENT_TYPE) })
  studentType: string;
}

export class OrderBatchDto {
  @ApiProperty({ description: 'Batch ID' })
  _id: string;

  @ApiProperty({ description: 'Batch name' })
  batchCode: string;

  @ApiProperty({ description: 'Start date' })
  startDate: Date;
}

export class GetOrdersResponseDto {
  @ApiProperty({ type: [Object] })
  orders: {
    _id: string;
    totalAmount: number;
    amountPaid: number;
    mobileNumber?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    user?: OrderUserDto;
    student?: OrderStudentDto;
    email?: string;
    courseName?: string;
    batch?: OrderBatchDto;
  }[];

  @ApiProperty({ description: 'Total number of orders' })
  total: number;
}
