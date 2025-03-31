import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Category } from 'src/schemas/category.schema';
import { COURSE_MODE } from 'src/common/constants/course.constants';
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
  youtubeUrl: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  brochure: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  certificate: string;

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
}
export class CreateCourseResponseDto {
  @ApiProperty()
  isSuccess: boolean;
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

  @ApiProperty()
  youtubeUrl: string | null;

  @ApiProperty()
  brochure: string;

  @ApiProperty()
  certificate: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  seatsAvailable: number;

  @ApiProperty()
  courseRating: number;
}
export class GetCourseDisplayResponseDto {
  @ApiProperty({ type: [CourseDisplay] })
  data: CourseDisplay[];
  @ApiProperty()
  count: number;
}

// export class UpdateCourseRequestParamsDto {
//   @IsMongoId()
//   courseId: string;
// }
// export class UpdateCourseRequestBodyDto {
//   @IsString()
//   @ApiProperty()
//   courseName: string;

//   @IsString()
//   @ApiProperty()
//   courseCode: string;

//   @IsString()
//   @IsNotEmpty()
//   @ApiProperty()
//   courseImage: string;

//   @IsString()
//   @IsNotEmpty()
//   @ApiProperty()
//   courseDescription: string;

//   @IsBoolean()
//   @ApiProperty()
//   featured: boolean;

//   @IsBoolean()
//   @ApiProperty()
//   active: boolean;
// }
// export class UpdateCourseResponseDto {
//   @ApiProperty()
//   isSuccess: boolean;
// }
