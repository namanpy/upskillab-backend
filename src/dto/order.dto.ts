import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsMongoId,
} from 'class-validator';
import { ORDER_STATUS } from 'src/common/constants/order.constants';
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

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Batch ID',
    example: '507f1f77bcf86cd799439011',
  })
  batch: string;
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

  @ApiProperty({
    type: User,
  })
  user: User;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  amountPaid: number;

  @ApiProperty()
  status: string;

  @ApiProperty({
    type: Batch,
  })
  batch: Batch;
}
