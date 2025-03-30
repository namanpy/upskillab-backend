import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsUrl } from 'class-validator';

export class CreateChapterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUrl() // Added URL validation
  videoLink: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseId: string;
}

export class Chapter {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  videoLink: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  courseId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetChaptersResponseDTO {
  @ApiProperty({ type: [Chapter] })
  chapters: Chapter[];
}