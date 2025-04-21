import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject, IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UniversityChapterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  chapterName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}

class UniversityModuleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  moduleName: string;

  @ApiProperty({ type: [UniversityChapterDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UniversityChapterDto)
  chapters: UniversityChapterDto[];
}

export class CreateUniversityCourseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseName: string;

  @ApiProperty({ type: [UniversityModuleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UniversityModuleDto)
  modules: UniversityModuleDto[];

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;
}

export class UniversityCourse {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  universityId: string;

  @ApiProperty()
  courseName: string;

  @ApiProperty({ type: [UniversityModuleDto] })
  modules: UniversityModuleDto[];

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetUniversityCoursesResponseDTO {
  @ApiProperty({ type: [UniversityCourse] })
  courses: UniversityCourse[];
}