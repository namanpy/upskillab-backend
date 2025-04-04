import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate } from 'class-validator';

export class GetBatchesRequestDTO {
 
  @ApiProperty()
  @IsNumber()
  skip: number;

  @ApiProperty()
  @IsNumber()
  limit: number;
}

export class GetBatchResponseDTO{
  @ApiProperty()
  @IsString()
  courseId: string;

  @IsString()
  @ApiProperty()
  batchId: string;

  @ApiProperty()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsString()
  courseName: string;

  @ApiProperty()
  @IsNumber()
  fees: number;

  @ApiProperty()
  @IsNumber()
  durationInDays: number;

  @ApiProperty()
  @IsNumber()
  remainingSeats: number;

  @ApiProperty() 
  @IsNumber()
  totalSeats: number;

  @ApiProperty()
  @IsDate()
  startTime: Date;

  @ApiProperty()
  @IsString()
  classMode: string;
}
