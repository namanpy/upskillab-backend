import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsBoolean, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateStoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  before: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  after: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  skills: string[];

  @ApiProperty()
  @IsBoolean()
  wallOfFame: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  salaryIncrease: number; // New field

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  batch_Year: string; // New field

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  duration: string; // New field
}

export class Story {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  jobTitle: string;

  @ApiProperty()
  userImageUrl: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  companyLogoUrl: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  before: string;

  @ApiProperty()
  after: string;

  @ApiProperty({ type: [String] })
  skills: string[];

  @ApiProperty()
  wallOfFame: boolean;

  @ApiProperty()
  salaryIncrease: number; // New field

  @ApiProperty()
  batch_Year: string; // New field

  @ApiProperty()
  duration: string; // New field

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetStoriesResponseDTO {
  @ApiProperty({ type: [Story] })
  stories: Story[];
}