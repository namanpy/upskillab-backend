import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, Validate, IsOptional } from 'class-validator';
import WordCountValidator from '../../common/utils/word-count.validator';

export class CreatePremiumLearningExperienceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(WordCountValidator, [6])
  title: string;

  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // @Validate(WordCountValidator, [20])
  // description: string;

  @ApiProperty()
  @IsBoolean()
  active: boolean;
}

export class UpdatePremiumLearningExperienceDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Validate(WordCountValidator, [6])
  title?: string;

  // @ApiProperty({ required: false })
  // @IsString()
  // @IsOptional()
  // @Validate(WordCountValidator, [20])
  // description?: string;

  @ApiProperty({ required: false, type: Boolean })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class PremiumLearningExperience {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  // @ApiProperty()
  // description: string;

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