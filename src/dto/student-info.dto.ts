import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsArray, IsNumber, IsOptional } from 'class-validator';

export class QualificationDTO {
  @ApiPropertyOptional({ description: 'College name of the student' })
  @IsString()
  @IsOptional()
  college?: string;
}

export class OrderHistoryDTO {
  @ApiProperty({ description: 'Order ID' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Total amount of the order' })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ description: 'Amount paid by the user' })
  @IsNumber()
  amountPaid: number;

  @ApiProperty({ description: 'Order status (e.g., COMPLETED, PENDING)' })
  @IsString()
  status: string;

  @ApiProperty({ description: 'Batch ID' })
  @IsString()
  batchId: string;

  @ApiProperty({ description: 'Course ID' })
  @IsString()
  courseId: string;

  @ApiProperty({ description: 'Course title' })
  @IsString()
  courseTitle: string;
}

export class StudentInfoDTO {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Email of the student' })
  @IsString()
  email: string;

  @ApiPropertyOptional({ description: 'Mobile number of the student' })
  @IsString()
  @IsOptional()
  mobileNumber?: string;

  @ApiProperty({ description: 'Username of the student' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Active status' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ description: 'Full name of the student' })
  @IsString()
  fullName: string;

  @ApiPropertyOptional({ description: 'College name of the student' })
  @IsString()
  @IsOptional()
  college?: string;

  @ApiProperty({ description: 'Type of student' })
  @IsString()
  studentType: string;

  @ApiPropertyOptional({ description: 'Profile image URL of the student' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ description: 'Bio of the student' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ description: 'Skills of the student', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @ApiProperty({ description: 'Order history of the student', type: [OrderHistoryDTO] })
  @IsArray()
  orderHistory: OrderHistoryDTO[];

  @ApiProperty({ description: 'Number of completed courses' })
  @IsNumber()
  completedCourses: number;

  @ApiProperty({ description: 'Number of pending courses' })
  @IsNumber()
  pendingCourses: number;
}

export class StudentInfoResponseDTO {
  @ApiProperty({ description: 'List of student info', type: [StudentInfoDTO] })
  students: StudentInfoDTO[];
}