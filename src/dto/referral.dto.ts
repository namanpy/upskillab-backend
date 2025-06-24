import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Types } from 'mongoose';
export class CreateReferralDto {
  // @ApiProperty()
  // @IsMongoId()
  // userId: string;

  @ApiProperty()
  @IsMongoId()
  courseId: Types.ObjectId;
}

export class ValidateReferralDto {
  @ApiProperty()
  @IsString()
  referralCode: string;

  @ApiProperty()
  @IsMongoId()
  courseId: string;
}

export class ApplyReferralResultDto {
  @ApiProperty()
  @IsString()
  referredBy: string;

  @ApiProperty()
  @IsMongoId()
  courseId: string;

  @ApiProperty()
  @IsString()
  discountType: 'percentage';

  @ApiProperty()
  @IsNotEmpty()
  discountValue: number;
}