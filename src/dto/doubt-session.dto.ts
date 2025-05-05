import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsIn,
} from 'class-validator';
import { Course } from 'src/schemas/course/course.schema';
import { Student } from 'src/schemas/student.schema';
import { User } from 'src/schemas/user.schema';
import { Teacher } from './teacher.dto';

export class CreateDoubtDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  attachments?: string[];
}

export class CreateDoubtResponseDto {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 'Doubt submitted successfully' })
  message: string;

  @ApiProperty()
  doubtId: string;
}

export class AddMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  attachments?: string[];
}

export class AddMessageResponseDto {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 'Message submitted successfully' })
  message: string;
}

export class AddAnswerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  response: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  attachments?: string[];
}

export class AddAnswerResponseDto {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 'Answer submitted successfully' })
  message: string;
}

export class DoubtMessageDto {
  @ApiProperty({ type: User })
  user: User;

  @ApiProperty({ type: Teacher })
  teacher?: Teacher;

  @ApiProperty({ type: Student })
  student?: Student;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional({ type: [String] })
  attachments?: string[];

  @ApiProperty()
  timestamp: Date;
}

// DTO for a single doubt in the list
export class DoubtListItemDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({
    type: Student,
  })
  student: Student; // Assuming student ID

  @ApiProperty({
    type: Course,
  })
  course: Course;

  @ApiProperty({
    type: Teacher,
  })
  teacher: Teacher; // Assuming teacher ID

  @ApiProperty()
  question: string;

  @ApiPropertyOptional({ type: [String] })
  attachments?: string[];

  @ApiPropertyOptional({ type: [DoubtMessageDto] })
  messages?: DoubtMessageDto[];

  // Add other relevant fields like createdAt, updatedAt if needed
}

// Response DTO for the GET /doubts endpoint
export class GetDoubtsResponseDto {
  @ApiProperty({ type: [DoubtListItemDto] })
  doubts: DoubtListItemDto[];
}
