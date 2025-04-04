import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateBatchDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  course: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalSeats: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  remainingSeats: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  teacher: string;

  @ApiProperty()
  @IsBoolean()
  active: boolean;
}

export class Batch {
  @ApiProperty()
  _id: string;

  @ApiProperty({ type: String, nullable: true })
  course: string | null;

  @ApiProperty()
  startTime: number;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  totalSeats: number;

  @ApiProperty()
  remainingSeats: number;

  @ApiProperty()
  duration: number;

  @ApiProperty({ type: String, nullable: true })
  teacher: string | null;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetBatchesResponseDTO {
  @ApiProperty({ type: [Batch] })
  batches: Batch[];
}

export class GetUpcomingBatchesRequestDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  skip: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  limit: number;
}

export class GetUpcomingBatchesResponseDTO {
  @ApiProperty({
    type: 'string',
  })
  courseId: Types.ObjectId;

  @ApiProperty({
    type: 'string',
  })
  batchId: Types.ObjectId;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  courseName: string;

  @ApiProperty()
  fees: number;

  @ApiProperty()
  durationInDays: number;

  @ApiProperty()
  remainingSeats: number;

  @ApiProperty()
  totalSeats: number;

  @ApiProperty()
  startTime: number;

  @ApiProperty()
  classMode: string;
}
