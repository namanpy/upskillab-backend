import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

// Response DTO for a single student
export class StudentResponseDto {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  email: string;

  @ApiProperty()
  mobileNumber?: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  orders: Array<{
    batchId: Types.ObjectId;
    batchName: string; // Added batchName
    courseId: Types.ObjectId; // Added courseId
    mobileNumber: string;
    status: string;
    totalAmount: number;
    amountPaid: number;
  }>;
}

// Response DTO for multiple students
export class StudentsResponseDto {
  @ApiProperty({ type: [StudentResponseDto] })
  students: StudentResponseDto[];
}

// DTO for updating a student
export class UpdateStudentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// Response DTO for delete operation
export class DeleteStudentResponseDto {
  @ApiProperty()
  message: string;
}