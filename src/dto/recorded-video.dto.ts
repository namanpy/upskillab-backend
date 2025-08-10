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

  @ApiProperty({ type: [String], description: 'Array of course IDs' })
  @IsMongoId({ each: true })
  @IsNotEmpty()
  courseIds: string[];
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

  @ApiPropertyOptional({ type: [String] })
  @IsMongoId({ each: true })
  @IsOptional()
  courseIds?: string[];

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
  courseIds?: string[];

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