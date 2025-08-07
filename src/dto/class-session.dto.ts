

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsMongoId,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

import { Batch } from 'src/schemas/course/batch.schema';

import { Teacher } from 'src/schemas/teacher.schema';

enum MeetingPlatform {
  ZOOM = 'zoom',
  GOOGLE_MEET = 'google_meet',
  MS_TEAMS = 'ms_teams',
}

export class CreateClassSessionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  batchIds: string[];

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  scheduledDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  scheduledStartTime: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  scheduledEndTime: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  meetingLink?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  meetingPassword?: string;

  @ApiProperty({ enum: MeetingPlatform, enumName: 'MeetingPlatform' })
  @IsEnum(MeetingPlatform)
  meetingPlatform: MeetingPlatform;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  teacherId: string;
}

export class UpdateClassSessionDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  batchIds: string[];

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  scheduledStartTime?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  scheduledEndTime?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  meetingLink?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  meetingPassword?: string;

  @ApiPropertyOptional()
  @IsEnum(MeetingPlatform)
  @IsOptional()
  meetingPlatform?: MeetingPlatform;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  teacherId?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  recordingUrl?: string;
}

export class ClassSession {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    type: Batch,
  })
  batchIds: string[];

  @ApiProperty()
  scheduledDate: Date;

  @ApiProperty()
  scheduledStartTime: string;

  @ApiProperty()
  scheduledEndTime: string;

  @ApiProperty()
  meetingLink: string;

  @ApiProperty()
  meetingPassword: string;

  @ApiProperty({
    description: 'zoom, google_meet, ms_teams',
  })
  meetingPlatform: string;

  @ApiProperty({
    type: Teacher,
  })
  teacherId: Teacher;

  @ApiProperty()
  isApproved: boolean;

  @ApiProperty()
  recordingUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetClassSessionsResponseDTO {
  @ApiProperty({ type: [ClassSession] })
  classSessions: ClassSession[];
}
