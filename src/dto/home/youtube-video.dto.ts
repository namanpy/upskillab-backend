import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateYoutubeVideoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  videoId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateYoutubeVideoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class YoutubeVideo {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  videoId: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetYoutubeVideosResponseDTO {
  @ApiProperty({ type: [YoutubeVideo] })
  videos: YoutubeVideo[];
}