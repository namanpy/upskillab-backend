import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsMongoId,
} from 'class-validator';

export class TopicDto {
  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  _id?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  topicName: string;

  @ApiProperty()
  @IsBoolean()
  active: boolean;
}
