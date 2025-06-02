import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class StudentDetails {
  @ApiProperty({ description: 'Full name of the student' })
  fullName: string;

  @ApiProperty({ description: 'Type of student (e.g., REGULAR)' })
  studentType: string;

  @ApiProperty({ description: 'Profile image URL' })
  image: string;
}

export class UserResponse {
  @ApiProperty({ description: 'User ID' })
  _id: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'Whether user is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Mobile number' })
  mobileNumber: string;

  @ApiProperty({ description: 'User type (e.g., STUDENT)' })
  userType: string;

  @ApiProperty({ description: 'Student details', type: StudentDetails })
  student: StudentDetails;
}

export class CourseResponse {
  @ApiProperty({ description: 'Course ID' })
  _id: string;

  @ApiProperty({ description: 'Course name' })
  courseName: string;

  // @ApiProperty({ description: 'Course code' })
  // courseCode: string;

  // @ApiProperty({ description: 'Course image URL' })
  // courseImage: string;

  // @ApiProperty({ description: 'Course mode (e.g., LIVE_ONLINE)' })
  // courseMode: string;

  // @ApiProperty({ description: 'Course duration' })
  // courseDuration: number;

  // @ApiProperty({ description: 'Original price' })
  // originalPrice: number;

  // @ApiProperty({ description: 'Discounted price' })
  // discountedPrice: number;

  // @ApiPropertyOptional({ description: 'YouTube URL' })
  // youtubeUrl?: string;

  // @ApiProperty({ description: 'Brochure URL' })
  // brochure: string;

  // @ApiProperty({ description: 'Course level (e.g., BEGINNER)' })
  // courseLevel: string;

  // @ApiProperty({ description: 'Certificate URL' })
  // certificate: string;

  // @ApiProperty({ description: 'Whether course is active' })
  // active: boolean;

  // @ApiProperty({ description: 'FAQs', type: [String] })
  // faqs: string[];

  // @ApiProperty({ description: 'Short description' })
  // shortDescription: string;

  // @ApiProperty({ description: 'Tags', type: [String] })
  // tags: string[];

  // @ApiProperty({ description: 'Program details' })
  // programDetails: string;

  // @ApiProperty({ description: 'Target audience', type: [String] })
  // targetAudience: string[];

  // @ApiProperty({ description: 'Whether course is featured' })
  // featured: boolean;

  // @ApiProperty({ description: 'Course rating' })
  // courseRating: number;

  // @ApiProperty({ description: 'Certifier logo URL' })
  // certifierLogo: string;
}

export class BatchResponse {
  @ApiProperty({ description: 'Batch ID' })
  _id: string;

  @ApiProperty({ description: 'Batch code' })
  batchCode: string;

  @ApiProperty({ description: 'Course details', type: CourseResponse })
  course: CourseResponse;

  // @ApiProperty({ description: 'Start time' })
  // startTime: string;

  // @ApiProperty({ description: 'Start date' })
  // startDate: Date;

  // @ApiProperty({ description: 'Total seats' })
  // totalSeats: number;

  // @ApiProperty({ description: 'Remaining seats' })
  // remainingSeats: number;

  // @ApiProperty({ description: 'Duration' })
  // Duration: number;

  // @ApiProperty({ description: 'Teacher ID' })
  // teacher: string;

  // @ApiProperty({ description: 'Image URL' })
  // imageUrl: string;

  // @ApiProperty({ description: 'Whether batch is active' })
  // active: boolean;

  // @ApiProperty({ description: 'Creation timestamp' })
  // createdAt: Date;

  // @ApiProperty({ description: 'Last update timestamp' })
  // updatedAt: Date;
}

export class OrderResponse {
  @ApiProperty({ description: 'Order ID' })
  _id: string;

  @ApiProperty({ description: 'User details', type: UserResponse })
  user: UserResponse;

  @ApiProperty({ description: 'Total amount' })
  totalAmount: number;

  @ApiProperty({ description: 'Amount paid' })
  amountPaid: number;

  @ApiProperty({ description: 'Order status' })
  status: string;

  @ApiProperty({ description: 'serialNumber' })
  serialNumber: string;

  @ApiProperty({ description: 'Batch details', type: BatchResponse })
  batch: BatchResponse;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class PaymentStatusResponse {
  @ApiProperty({ description: 'Payment ID' })
  _id: string;

  @ApiProperty({ description: 'Order details', type: OrderResponse })
  order: OrderResponse;

  @ApiProperty({ description: 'Payment method' })
  paymentMethod: string;

  @ApiProperty({ description: 'Transaction ID' })
  transactionId: string;

  @ApiProperty({ description: 'Payment amount' })
  amount: number;

  @ApiProperty({ description: 'Payment status' })
  status: string;

  @ApiProperty({ description: 'Payment mode (e.g., UPI)' })
  paymentMode: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: string;
}

export class GetPaymentStatusResponseDTO {
  @ApiProperty({ type: [PaymentStatusResponse], description: 'List of payment statuses' })
  payments: PaymentStatusResponse[];
}