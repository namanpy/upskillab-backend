import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsDateString } from 'class-validator';

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
  startDate: string;

  @ApiProperty()
  totalSeats: number;

  @ApiProperty()
  remainingSeats: number;

  @ApiProperty()
  duration: string;

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