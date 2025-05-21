import { Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

// Existing DTOs (unchanged, included for completeness)
export class LiveClassResponseDto {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  meetingLink: string;

  @ApiProperty()
  scheduledDate: Date;

  @ApiProperty()
  scheduledStartTime: string;

  @ApiPropertyOptional({ description: 'Whether the user attended the class' })
  @IsBoolean()
  isAttended?: boolean;
}

export class LiveClassesResponseDto {
  @ApiProperty({ type: [LiveClassResponseDto] })
  classes: LiveClassResponseDto[];
}

export class UserAttendanceResponseDto {
  @ApiProperty({ type: [LiveClassResponseDto] })
  classes: LiveClassResponseDto[];
}

export class MarkAttendanceDto {
  @ApiProperty()
  @IsBoolean()
  isAttended: boolean;
}

export class MarkAttendanceResponseDto {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  classId: Types.ObjectId;

  @ApiProperty()
  userId: Types.ObjectId;

  @ApiProperty()
  isAttended: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

// New DTO for class attendance details
export class ClassAttendanceResponseDto {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  meetingLink: string;

  @ApiProperty()
  scheduledDate: Date;

  @ApiProperty()
  scheduledStartTime: string;

  @ApiProperty({ description: 'Total number of students who marked attendance' })
  totalAttended: number;

  @ApiProperty()
  // userId: Types.ObjectId;
  students: { userId: Types.ObjectId; isAttended: boolean }[];
}