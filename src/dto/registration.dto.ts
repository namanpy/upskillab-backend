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

export class NoBatchRegistrationResponseDto {
  @ApiProperty({ type: String })
  orderId: Types.ObjectId;

  @ApiProperty({
    type: String,
  })
  paymentSessionId: string;
}
