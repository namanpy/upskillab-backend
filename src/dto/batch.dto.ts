import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class GetBatchesRequestDTO {
 
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  skip: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  limit: number;
}

export class GetBatchResponseDTO{

  @ApiProperty({
    type: 'string'
  })
  courseId: Types.ObjectId;

  @ApiProperty({
    type: 'string'
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
