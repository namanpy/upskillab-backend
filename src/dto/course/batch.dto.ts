import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsOptional,
  Matches,
} from 'class-validator';
import { Types } from 'mongoose';
import { Course } from 'src/schemas/course/course.schema';
import { Teacher } from '../teacher.dto';

export class CreateBatchDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  course: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'Start time in HH:mm format',
    example: '09:30',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:mm format (e.g., 09:30)',
  })
  startTime: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalSeats: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  remainingSeats: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  teacher: string;

  @ApiProperty()
  @IsBoolean()
  active: boolean;
}

export class BatchResponse {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty({ type: Course, nullable: true })
  course: Course;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  totalSeats: number;

  @ApiProperty()
  remainingSeats: number;

  @ApiProperty()
  duration: number;

  @ApiProperty({ type: Teacher, nullable: true })
  teacher: Teacher;

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
  @ApiProperty({ type: [BatchResponse] })
  batches: BatchResponse[];
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
  startTime: string;

  @ApiProperty()
  classMode: string;
}
