import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, IsBoolean, IsOptional } from 'class-validator';

export class CreateMarketingPromptDTO {
  @ApiProperty({ description: 'Name for the marketing prompt' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Image URL for the marketing prompt' })
  @IsString()
  @IsUrl()
  image: string;

  @ApiProperty({ description: 'Whether the prompt is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateMarketingPromptDTO {
  @ApiProperty({ description: 'Name for the marketing prompt' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Image URL for the marketing prompt' })
  @IsString()
  @IsUrl()
  @IsOptional()
  image?: string;

  @ApiProperty({ description: 'Whether the prompt is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class MarketingPromptResponseDTO {
  @ApiProperty({ description: 'Unique ID of the marketing prompt' })
  _id: string;

  @ApiProperty({ description: 'Name for the marketing prompt' })
  name: string;

  @ApiProperty({ description: 'Image URL for the marketing prompt' })
  image: string;

  @ApiProperty({ description: 'Whether the prompt is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}