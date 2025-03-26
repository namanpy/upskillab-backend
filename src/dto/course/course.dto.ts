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
import { Course } from 'src/schemas/course/course.schema';

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

class CourseDisplay extends Course {
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
