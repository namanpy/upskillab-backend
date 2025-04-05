import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsBoolean } from 'class-validator';

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
  role: string; // New field

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string; // New field

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  before: string; // New field

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  after: string; // New field

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  skills: string[]; // New field, array of strings

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  batch_Year: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  salaryIncrease: string;

  @ApiProperty()
  @IsBoolean()
  wallOfFame: boolean; // New field
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
  role: string; // New field

  @ApiProperty()
  companyName: string; // New field

  @ApiProperty()
  before: string; // New field

  @ApiProperty()
  after: string; // New field

  @ApiProperty({ type: [String] })
  skills: string[]; // New field

  @ApiProperty()
  duration: string;

  @ApiProperty()
  batch_Year: string;

  @ApiProperty()
  salaryIncrease: string;

  @ApiProperty()
  wallOfFame: boolean; // New field

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetStoriesResponseDTO {
  @ApiProperty({ type: [Story] })
  stories: Story[];
}