import { Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

// Response DTO for live class details
export class LiveClassResponseDto {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  meetingLink: string;

  @ApiProperty()
  scheduledDate: Date;

  @ApiProperty()
  scheduledStartTime: string;

  @ApiProperty({ description: 'Whether the user attended the class' })
  @IsBoolean()
  isAttended: boolean;
}

// Response DTO for multiple live classes
export class LiveClassesResponseDto {
  @ApiProperty({ type: [LiveClassResponseDto] })
  classes: LiveClassResponseDto[];
}

// Response DTO for user attendance history
export class UserAttendanceResponseDto {
  @ApiProperty({ type: [LiveClassResponseDto] })
  classes: LiveClassResponseDto[];
}

// DTO for marking attendance
export class MarkAttendanceDto {
  @ApiProperty()
  @IsBoolean()
  isAttended: boolean;
}

// Response DTO for marking attendance
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