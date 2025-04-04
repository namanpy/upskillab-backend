import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Language } from 'src/schemas/language.schema';

export class CreateLanguageRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Language code',
    example: 'EN',
  })
  languageCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Language name',
    example: 'English',
  })
  languageName: string;
}

export class CreateLanguageResponseDto {
  @ApiProperty()
  isSuccess: boolean;
}

export class GetLanguagesRequestDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Search string for language name or code',
  })
  search?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({
    description: 'Number of items to skip',
    minimum: 0,
  })
  skip?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Number of items to return',
    minimum: 1,
  })
  limit?: number;
}

export class GetLanguagesResponseDto {
  @ApiProperty({
    type: [Language],
  })
  data: Language[];

  @ApiProperty()
  count: number;
}

export class UpdateLanguageParamDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  languageId: string;
}

export class UpdateLanguageRequestDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  languageCode?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  languageName?: string;
}

export class UpdateLanguageResponseDto {
  @ApiProperty()
  isSuccess: boolean;
}
