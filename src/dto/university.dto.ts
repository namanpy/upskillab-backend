import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUniversityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  institutionType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deliveryMode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  programType: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty({ each: true })
  programs: string[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  reviews: number;

  @ApiProperty({ type: Boolean })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  certification: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  logoUrl: string;
}

export class University {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  institutionType: string;

  @ApiProperty()
  deliveryMode: string;

  @ApiProperty()
  programType: string;

  @ApiProperty({ type: [String] })
  programs: string[];

  @ApiProperty()
  rating: number;

  @ApiProperty()
  reviews: number;

  @ApiProperty()
  certification: boolean;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  logoUrl: string;
}

export class GetUniversitiesResponseDTO {
  @ApiProperty({ type: [University] })
  universities: University[];
}