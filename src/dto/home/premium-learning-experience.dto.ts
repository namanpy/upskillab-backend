import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreatePremiumLearningExperienceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string; // Changed from string[] to string

  @ApiProperty()
  @IsBoolean()
  active: boolean;
}

export class PremiumLearningExperience {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string; // Changed from string[] to string

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetPremiumLearningExperiencesResponseDTO {
  @ApiProperty({ type: [PremiumLearningExperience] })
  premiumLearningExperiences: PremiumLearningExperience[];
}