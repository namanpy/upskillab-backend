import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateStatsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  count: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  active: boolean;
}

export class Stats {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  count: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetStatsResponseDTO {
  @ApiProperty({ type: [Stats] })
  stats: Stats[];
}