import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsOptional, IsDateString, IsUUID } from 'class-validator';

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

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  batchId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  courseId: string;

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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  meetingLink: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  meetingPassword?: string;

  @ApiProperty({ enum: MeetingPlatform, enumName: 'MeetingPlatform' })
  @IsEnum(MeetingPlatform)
  meetingPlatform: MeetingPlatform;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  teacherId: string;

  @ApiProperty()
  @IsBoolean()
  isRecorded: boolean;
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

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  batchId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  courseId?: string;

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
  @IsUUID()
  @IsOptional()
  teacherId?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isRecorded?: boolean;

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

  @ApiProperty()
  batchId: string;

  @ApiProperty()
  batchName: string;

  @ApiProperty()
  courseId: string;

  @ApiProperty()
  courseName: string;

  @ApiProperty()
  scheduledDate: string;

  @ApiProperty()
  scheduledStartTime: string;

  @ApiProperty()
  scheduledEndTime: string;

  @ApiProperty()
  meetingLink: string;

  @ApiProperty()
  meetingPassword: string;

  @ApiProperty()
  meetingPlatform: MeetingPlatform;

  @ApiProperty()
  teacherId: string;

  @ApiProperty()
  teacherName: string;

  @ApiProperty()
  isRecorded: boolean;

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