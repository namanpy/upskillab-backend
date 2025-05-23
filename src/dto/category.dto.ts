import {
  IsOptional,
  IsMongoId,
  IsInt,
  Min,
  IsString,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from 'src/schemas/category.schema';

export class CreateCategoryRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  categoryName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  categoryCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  categoryImage: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryLogo: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  categoryDescription: string;

  @IsBoolean()
  @ApiProperty()
  featured: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  active: boolean = true;
}
export class CreateCategoryResponseDto {
  @ApiProperty()
  isSuccess: boolean;
}

export class GetCategoryRequestDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  searchString?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  featured?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional()
  skip?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional()
  limit?: number;
}
export class GetCategoryResponseDto {
  @ApiProperty({ type: [Category] })
  data: Category[];
  @ApiProperty()
  count: number;
}

export class UpdateCategoryRequestParamsDto {
  @IsMongoId()
  categoryId: string;
}
export class UpdateCategoryRequestBodyDto {
  @IsString()
  @ApiProperty()
  categoryName: string;

  @IsString()
  @ApiProperty()
  categoryCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  categoryImage: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryLogo?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  categoryDescription: string;

  @IsBoolean()
  @ApiProperty()
  featured: boolean;

  @IsBoolean()
  @ApiProperty()
  active: boolean;
}
export class UpdateCategoryResponseDto {
  @ApiProperty()
  isSuccess: boolean;
}

export class GetCategoryByCodeParamDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Category code',
    example: 'WEB-DEV',
  })
  categoryCode: string;
}

export class GetCategoryByCodeResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  categoryName: string;

  @ApiProperty()
  categoryCode: string;

  @ApiProperty()
  categoryImage: string;

  @ApiPropertyOptional()
  categoryLogo?: string;

  @ApiProperty()
  categoryDescription: string;

  @ApiProperty()
  featured: boolean;

  @ApiProperty()
  active: boolean;
}
