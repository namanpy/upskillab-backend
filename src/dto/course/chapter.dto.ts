import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { TopicDto } from './topic.dto';

export class ChapterDto {
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
