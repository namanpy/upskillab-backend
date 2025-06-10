// src/dto/feedback.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional, IsMongoId } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ description: 'Teacher ID to give feedback to' })
  @IsNotEmpty()
  @IsMongoId()
  teacherId: string;

  @ApiProperty({ description: 'Class session ID for which feedback is given' })
  @IsNotEmpty()
  @IsMongoId()
  classSessionId: string;

  @ApiProperty({ description: 'Rating from 1 to 5', minimum: 1, maximum: 5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Optional feedback message', required: false })
  @IsOptional()
  @IsString()
  message?: string;
}

export class UpdateFeedbackDto {
  @ApiProperty({ description: 'Rating from 1 to 5', minimum: 1, maximum: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ description: 'Optional feedback message', required: false })
  @IsOptional()
  @IsString()
  message?: string;
}

export class FeedbackDto {
  _id: string;
  studentId: string;
  teacherId: string;
  classSessionId: string;
  batchId: string;
  rating: number;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Populated fields
  studentName?: string;
  teacherName?: string;
  batchName?: string;
  sessionTitle?: string;
}

export class GetFeedbacksResponseDTO {
  feedbacks: FeedbackDto[];
}

export class TeacherFeedbackSummaryDto {
  _id: string;
  teacherName: string;
  totalFeedbacks: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recentFeedbacks: FeedbackDto[];
}

export class GetTeacherFeedbackSummaryResponseDTO {
  summary: TeacherFeedbackSummaryDto;
}

export class GetAllTeachersSummaryResponseDTO {
  teachers: TeacherFeedbackSummaryDto[];
}