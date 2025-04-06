import {
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  IsMongoId,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Category } from 'src/schemas/category.schema';
import {
  COURSE_LEVELS,
  COURSE_MODE,
} from 'src/common/constants/course.constants';
import { Types } from 'mongoose';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChapterDto } from './chapter.dto';
import { Constant } from '../common.dto';
import { Language } from 'src/schemas/language.schema';
import { Batch } from 'src/schemas/course/batch.schema';

class FaqDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class CreateCourseRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseImage: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseMode: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  courseDuration: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  originalPrice: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  discountedPrice: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  youtubeUrl: string | null = null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  brochure?: string | null = null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  certificate?: string | null = null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseLevel: string;

  @ApiProperty()
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty()
  @IsBoolean()
  active: boolean;

  @ApiProperty({ type: [ChapterDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChapterDto)
  chapters: ChapterDto[];

  @ApiProperty({ type: [FaqDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FaqDto)
  faqs: FaqDto[];
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  tags: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  programDetails: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  targetAudience: string[];
}
export class CreateCourseResponseDto {
  @ApiProperty()
  isSuccess: boolean;
}

enum SortField {
  COURSE_NAME = 'courseName',
  CATEGORY = 'category',
  MODE = 'courseMode',
  DURATION = 'courseDuration',
  ORIGINAL_PRICE = 'originalPrice',
  DISCOUNTED_PRICE = 'discountedPrice',
  ACTIVE = 'active',
}

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

class SortOption {
  @ApiProperty({ enum: SortField })
  @IsEnum(SortField)
  field: SortField;

  @ApiProperty({ enum: SortOrder, default: SortOrder.ASC })
  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.ASC;
}

export class GetCourseDisplayRequestDto {
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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortOption)
  @ApiPropertyOptional({
    type: [SortOption],
    description: 'Array of sort options',
  })
  sort?: SortOption[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by multiple category IDs',
  })
  categoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by multiple category IDs',
  })
  languageIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(Object.keys(COURSE_LEVELS), { each: true })
  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by course levels',
  })
  courseLevels?: string[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Search courses by name or code',
  })
  search?: string;
}

class CourseDisplay {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty()
  courseName: string;

  @ApiProperty({
    type: Category,
  })
  declare category: Category;

  @ApiProperty()
  courseCode: string;

  @ApiProperty()
  courseImage: string;

  @ApiProperty()
  courseMode: string;

  @ApiProperty()
  courseDuration: number;

  @ApiProperty()
  originalPrice: number;

  @ApiProperty()
  discountedPrice: number;

  @ApiPropertyOptional()
  youtubeUrl: string | null;

  @ApiProperty()
  brochure?: string;

  @ApiProperty()
  certificate?: string;

  @ApiProperty({
    type: Constant,
  })
  courseLevel: Constant;

  @ApiProperty({
    type: Language,
  })
  language: Language;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  seatsAvailable: number;

  @ApiProperty()
  studentsEnrolled: number;

  @ApiProperty()
  courseRating: number;

  @ApiProperty()
  shortDescription: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  programDetails: string;

  @ApiProperty({ type: [String] })
  targetAudience: string[];
}
export class GetCourseDisplayResponseDto {
  @ApiProperty({ type: [CourseDisplay] })
  data: CourseDisplay[];
  @ApiProperty()
  count: number;
}

export class UpdateCourseRequestParamDto {
  @ApiProperty()
  @IsMongoId()
  courseId: string;
}

export class UpdateCourseRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  courseName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  courseCode?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  courseImage?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  courseMode?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @IsOptional()
  courseDuration?: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  originalPrice?: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  discountedPrice?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  youtubeUrl?: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  brochure?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  certificate?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  courseLevel?: string;

  @ApiProperty()
  @IsMongoId()
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiProperty({ type: [ChapterDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChapterDto)
  @IsOptional()
  chapters?: ChapterDto[];

  @ApiProperty({ type: [FaqDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FaqDto)
  @IsOptional()
  faqs?: FaqDto[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  programDetails?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  targetAudience?: string[];
}

export class UpdateCourseResponseDto {
  @ApiProperty()
  isSuccess: boolean;
}

export class GetCourseByCodeRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseCode: string;
}
export class GetCourseByCodeResponseDto {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  courseName: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  categoryName: string;

  @ApiProperty()
  courseCode: string;

  @ApiProperty()
  courseImage: string;

  @ApiProperty()
  courseMode: string;

  @ApiProperty()
  courseDuration: number;

  @ApiProperty()
  originalPrice: number;

  @ApiProperty()
  discountedPrice: number;

  @ApiProperty()
  youtubeUrl: string | null;

  @ApiPropertyOptional()
  brochure?: string;

  @ApiPropertyOptional()
  certificate?: string;

  @ApiProperty({
    type: Constant,
  })
  courseLevel: Constant;

  @ApiProperty({
    type: Language,
  })
  language: Language;

  @ApiProperty()
  active: boolean;

  @ApiProperty({ type: [ChapterDto] })
  chapters: ChapterDto[];

  @ApiPropertyOptional({ type: Batch })
  batch?: Batch;

  @ApiProperty({ type: [FaqDto] })
  faqs: FaqDto[];

  @ApiProperty()
  shortDescription: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  programDetails: string;

  @ApiProperty({ type: [String] })
  targetAudience: string[];
}
