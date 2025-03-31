import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class TopicDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  topicName: string;

  @ApiProperty()
  @IsBoolean()
  active: boolean;
}
