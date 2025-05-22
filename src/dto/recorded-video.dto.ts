import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { VIDEO_STATUS } from '../common/constants/recorded-video.constants';
export class CreateRecordedVideoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;


  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  videoUrl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  chapterId: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  courseId: string;
}

export class UpdateRecordedVideoDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  chapterId?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  courseId?: string;

  @ApiPropertyOptional({ enum: VIDEO_STATUS })
  @IsEnum(VIDEO_STATUS)
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class RecordedVideo {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  videoUrl: string;

  @ApiProperty()
  duration: string;

  @ApiProperty()
  chapterId: string;

  @ApiProperty()
  courseId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetRecordedVideosResponseDTO {
  @ApiProperty({ type: [RecordedVideo] })
  videos: RecordedVideo[];
}