import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Batch } from 'src/schemas/course/batch.schema';

export class BatchRegistrationRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
  @Length(10, 10)
  phone: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  batchId: string;

  @IsString()
  @IsOptional()
  couponCode?: string;

  @IsString()
  @IsOptional()
  referralCode?: string;
}

export class BatchRegistrationResponseDto {
  @ApiProperty({ type: String })
  orderId: Types.ObjectId;

  @ApiProperty({
    type: String,
  })
  paymentSessionId: string;
}
export class NoBatchRegistrationRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
  @Length(10, 10)
  phone: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Amount user is paying' })
  amount: number;

  @ApiProperty()
  batchId: string;
}

export class NoBatchRegistrationResponseDto {
  @ApiProperty({ type: String })
  orderId: Types.ObjectId;

  @ApiProperty({ type: String })
  paymentSessionId: string;

  @ApiProperty({ type: Number, description: 'Total course amount' })
  totalAmount: number;

  @ApiProperty({ type: Number, description: 'Amount user is paying' })
  amountPaying: number;
}

export class NoBatchsRegistrationRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
  @Length(10, 10)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  courseName: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;
}


export class registerExternelPaymentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  @IsOptional()
  batchId?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
  @Length(10, 10)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsOptional()
  courseName?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  mode: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;
}

export class NoBatchsRegistrationResponseDto {
  @ApiProperty({ type: String })
  orderId: Types.ObjectId;

  @ApiProperty({
    type: String,
  })
  paymentSessionId: string;
}
