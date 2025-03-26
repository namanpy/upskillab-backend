import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Course } from 'src/schemas/course/course.schema';
import { Category } from 'src/schemas/category.schema';
import { COURSE_MODE } from 'src/common/constants/course.constants';
import { Types } from 'mongoose';

// export class CreateCourseRequestDto {
//   @IsString()
//   @IsNotEmpty()
//   @ApiProperty()
//   courseName: string;

//   @IsString()
//   @IsNotEmpty()
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
//   @IsOptional()
//   @ApiProperty({
//     required: false,
//   })
//   active: boolean = true;
// }
// export class CreateCourseResponseDto {
//   @ApiProperty()
//   isSuccess: boolean;
// }

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
  courseMode: keyof typeof COURSE_MODE;

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
