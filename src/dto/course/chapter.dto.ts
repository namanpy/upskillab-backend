import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
  IsArray,
  IsBoolean,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { TopicDto } from './topic.dto';

export class ChapterDto {
  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  _id?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  chapterNumber: number;

  @ApiProperty()
  @IsNumber()
  week: number;

  @ApiProperty()
  @IsNumber()
  session: number;

  @ApiProperty({ type: [TopicDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TopicDto)
  topics: TopicDto[];

  @ApiProperty()
  @IsBoolean()
  active: boolean;
}
